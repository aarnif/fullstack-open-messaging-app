import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";

import ModalProvider from "../components/ModalProvider.jsx";
import GroupChatInfo from "../components/GroupChatInfo.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  findGroupChatByIdMock,
  allContactsByUserMock,
  allContactsByUserMockWithoutSearchWord,
} = queryMocks;

const { leaveGroupChatMock, deleteChatMock } = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const anotherUserData = allContactsByUserMock.result.data.allContactsByUser[0];
const chatData = findGroupChatByIdMock.result.data.findChatById;

const mockSetShowGroupChatInfo = vi.fn();
const mockHandleDeleteChat = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useMatch: vi.fn(),
  };
});

const renderComponent = (mockUserData = userData, mockChatData = chatData) => {
  render(
    <MockedProvider
      mocks={[
        currentUserMock,
        findGroupChatByIdMock,
        allContactsByUserMock,
        allContactsByUserMockWithoutSearchWord,
        leaveGroupChatMock,
        deleteChatMock,
      ]}
      addTypename={false}
    >
      <MemoryRouter>
        <ModalProvider>
          <GroupChatInfo
            user={mockUserData}
            chat={mockChatData}
            setShowGroupChatInfo={mockSetShowGroupChatInfo}
            handleDeleteChat={mockHandleDeleteChat}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<GroupChatInfo />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("group-chat-info-modal")).toBeInTheDocument();
    expect(screen.getByText(chatData.title)).toBeInTheDocument();
    expect(screen.getByText(chatData.description)).toBeInTheDocument();
  });

  test("displays 'no description' when no chat description is provided", () => {
    const groupChatDataWithoutDescriptionMock = {
      ...findGroupChatByIdMock.result.data.findChatById,
      description: "",
    };
    renderComponent(userData, groupChatDataWithoutDescriptionMock);

    expect(screen.getByTestId("group-chat-info-modal")).toBeInTheDocument();
    expect(screen.getByText(chatData.title)).toBeInTheDocument();
    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  test("closes modal on close button click", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("close-group-chat-info-button"));

    expect(mockSetShowGroupChatInfo).toHaveBeenCalledWith(false);
  });

  test("opens edit group chat modal on button click", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("edit-group-chat-button"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-group-chat-modal")).toBeInTheDocument();
    });
  });

  test("hides leave button when user is chat admin", () => {
    renderComponent();

    expect(
      screen.queryByTestId("leave-group-chat-button")
    ).not.toBeInTheDocument();
  });

  test("allows user to leave group chat with confirmation", async () => {
    const user = userEvent.setup();

    renderComponent(anotherUserData);

    await user.click(screen.getByTestId("leave-group-chat-button"));

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to leave the chat?")
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-button"));

    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("deletes group chat with confirmation when user is admin", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByTestId("delete-group-chat-button"));

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete the chat?/)
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-button"));

    expect(mockHandleDeleteChat).toHaveBeenCalled();
  });
});
