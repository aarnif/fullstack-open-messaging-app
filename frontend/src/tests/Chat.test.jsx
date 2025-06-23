import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useMatch, useLocation } from "react-router";
import userEvent from "@testing-library/user-event";

import ModalProvider from "../components/ModalProvider.jsx";
import Chat from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock, findPrivateChatByIdMock } =
  queryMocks;

const { createNewChatMock, mockNewChatInfo } = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetActiveMenuItem = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();

const groupChatMatch = findGroupChatByIdMock.request.variables.chatId;
const privateChatMatch = findPrivateChatByIdMock.request.variables.chatId;

Element.prototype.scrollIntoView = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useMatch: vi.fn(),
    useLocation: vi.fn(),
  };
});

Object.defineProperty(global, "localStorage", { value: localStorage });

const renderExistingChatComponent = (mockData = [findGroupChatByIdMock]) => {
  useLocation.mockReturnValue({ pathname: "/chats/1" });
  render(
    <MockedProvider mocks={mockData} addTypename={false}>
      <MemoryRouter>
        <ModalProvider>
          <Chat
            user={userData}
            setActiveMenuItem={mockSetActiveMenuItem}
            setActiveChatOrContactId={mockSetActiveChatOrContactId}
            menuComponent={<></>}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderNewChatComponent = (mockData = [createNewChatMock]) => {
  useLocation.mockReturnValue({ pathname: "/chats/new" });
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <Chat
            user={userData}
            setActiveMenuItem={mockSetActiveMenuItem}
            setActiveChatOrContactId={mockSetActiveChatOrContactId}
            menuComponent={<></>}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<Chat />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.setItem("new-chat-info", JSON.stringify(mockNewChatInfo));
  });

  test("renders new chat page", async () => {
    renderNewChatComponent();

    expect(screen.getByTestId("new-chat-page")).toBeInTheDocument();
  });

  test("renders existing chat component with loading state", () => {
    useMatch.mockReturnValue({
      params: { chatId: groupChatMatch },
    });

    renderExistingChatComponent();

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders existing chat component with chat info after loading", async () => {
    useMatch.mockReturnValue({
      params: { chatId: groupChatMatch },
    });

    renderExistingChatComponent();

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    });
  });

  test("renders error if chat not found", async () => {
    useMatch.mockReturnValue({
      params: { chatId: groupChatMatch },
    });

    const findChatByIdMockError = {
      ...findGroupChatByIdMock,
      result: {
        ...findGroupChatByIdMock.result,
        data: { findChatById: null },
      },
    };
    renderExistingChatComponent([findChatByIdMockError]);

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chat-not-found")).toBeInTheDocument();
    });
  });

  test("displays group chat info modal on button click", async () => {
    useMatch.mockReturnValue({
      params: { chatId: groupChatMatch },
    });

    renderExistingChatComponent();

    await waitFor(() => {
      expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("chat-info-button"));

    await waitFor(() => {
      expect(screen.getByTestId("group-chat-info-modal")).toBeInTheDocument();
    });
  });

  test("redirects to contact page when clicking private chat info", async () => {
    useMatch.mockReturnValue({
      params: { chatId: privateChatMatch },
    });

    const anotherChatMember =
      findPrivateChatByIdMock.result.data.findChatById.members.find(
        (member) => member.id !== userData.id
      );

    renderExistingChatComponent([findPrivateChatByIdMock]);

    await waitFor(() => {
      expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("chat-info-button"));

    expect(navigate).toHaveBeenCalledWith(`/contacts/${anotherChatMember.id}`);
  });
});
