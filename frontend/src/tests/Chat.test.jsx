import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useMatch } from "react-router";
import userEvent from "@testing-library/user-event";

import Chat from "../components/Chat/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock, findPrivateChatByIdMock } =
  queryMocks;

const {
  markAllMessagesInGroupChatReadMock,
  markAllMessagesInPrivateChatReadMock,
} = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetActiveMenuItem = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();
const mockModal = vi.fn();
const groupChatMatch = findGroupChatByIdMock.request.variables.chatId;
const privateChatMatch = findPrivateChatByIdMock.request.variables.chatId;

Element.prototype.scrollIntoView = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useMatch: vi.fn(),
  };
});

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: mockModal,
  }),
}));

const renderComponent = (
  mockData = [findGroupChatByIdMock, markAllMessagesInGroupChatReadMock]
) => {
  render(
    <MockedProvider mocks={mockData} addTypename={false}>
      <MemoryRouter>
        <Chat
          user={userData}
          setActiveMenuItem={mockSetActiveMenuItem}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
          menuComponent={<></>}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<Chat />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    useMatch.mockReturnValue({
      params: { chatId: groupChatMatch },
    });
  });

  test("renders component with loading state", () => {
    renderComponent();

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders component with chat info after loading", async () => {
    renderComponent();

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chat-info")).toBeInTheDocument();
    });
  });

  test("renders error if chat not found", async () => {
    const findChatByIdMockError = {
      ...findGroupChatByIdMock,
      result: {
        ...findGroupChatByIdMock.result,
        data: { findChatById: null },
      },
    };
    renderComponent([
      findChatByIdMockError,
      markAllMessagesInGroupChatReadMock,
    ]);

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chat-not-found")).toBeInTheDocument();
    });
  });

  test("click display group chat info modal works", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("chat-info")).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("chat-info-button"));

    await waitFor(() => {
      expect(screen.getByTestId("group-chat-info-modal")).toBeInTheDocument();
    });
  });

  test("click display private chat info modal works", async () => {
    useMatch.mockReturnValue({
      params: { chatId: privateChatMatch },
    });

    renderComponent([
      findPrivateChatByIdMock,
      markAllMessagesInPrivateChatReadMock,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId("chat-info")).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("chat-info-button"));

    await waitFor(() => {
      expect(screen.getByTestId("private-chat-info-modal")).toBeInTheDocument();
    });
  });
});
