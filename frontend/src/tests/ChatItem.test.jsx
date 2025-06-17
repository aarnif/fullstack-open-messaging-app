import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import { ChatItem } from "../components/ui/ListMenu.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers.js";

const { currentUserMock, findGroupChatByIdMock } = queryMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const mockChatData = findGroupChatByIdMock.result.data.findChatById;

const mockSetActiveChatOrContactId = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Refactored render function with flexible options
const renderChatItem = (options = {}) => {
  const {
    user = userData,
    chat = mockChatData,
    activeChatOrContactId = mockChatData.id,
    mocks = [currentUserMock, findGroupChatByIdMock],
  } = options;

  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <ChatItem
          index={0}
          user={user}
          chat={chat}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ChatItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders chat item with correct info", () => {
    renderChatItem();

    expect(
      screen.getByTestId(`chat-item-${mockChatData.id}`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("chat-card")).toBeInTheDocument();
    expect(screen.getByText(mockChatData.title)).toBeInTheDocument();
    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });

  test("renders nothing when chat has no messages", () => {
    const chatWithNoMessages = {
      ...mockChatData,
      messages: [],
    };

    const { container } = renderChatItem({ chat: chatWithNoMessages });
    expect(container.firstChild).toBeNull();
  });

  test("highlights active contact", () => {
    renderChatItem();

    expect(screen.getByRole("button")).toHaveAttribute("id", "active-chat");
  });

  test("does not highlight inactive contact", () => {
    renderChatItem({ activeChatOrContactId: "inactive-contact-id" });

    expect(screen.getByRole("button")).not.toHaveAttribute(
      "id",
      "chat-contact"
    );
  });

  test("navigates to chat page on click", async () => {
    const user = userEvent.setup();
    renderChatItem();

    await user.click(screen.getByTestId(`chat-item-${mockChatData.id}`));

    expect(navigate).toHaveBeenCalledWith(`/chats/${mockChatData.id}`);
    expect(mockSetActiveChatOrContactId).toHaveBeenCalledWith(mockChatData.id);
  });

  test("do not display new messages count if count zero", () => {
    renderChatItem();
    expect(screen.queryByTestId("new-messages-count")).not.toBeInTheDocument();
  });

  test("displays new messages count if count greater than zero", () => {
    const userWithUnreadMessages = {
      ...userData,
      unreadMessages: [
        {
          chatId: {
            id: mockChatData.id,
            title: mockChatData.title,
            image: mockChatData.image,
            isGroupChat: mockChatData.isGroupChat,
          },
          messages: [{ messageId: "msg1" }, { messageId: "msg2" }],
        },
      ],
    };

    renderChatItem({ user: userWithUnreadMessages });

    const badge = screen.queryByTestId("new-messages-count");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("2");
  });

  test("displays notification message correctly", () => {
    const chatWithNotification = {
      ...mockChatData,
      messages: [
        {
          ...mockChatData.messages[0],
          type: "notification",
          content: "User joined the chat",
          sender: { id: "someone-else", name: "Someone Else" },
        },
      ],
    };

    renderChatItem({ chat: chatWithNotification });
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "User joined the chat"
    );
  });

  test("displays text message from current user correctly", () => {
    const message = "Hello world";
    const chatWithMessage = {
      ...mockChatData,
      messages: [
        {
          ...mockChatData.messages[0],
          type: "text",
          content: message,
          sender: { id: userData.id, name: userData.name },
        },
      ],
    };

    renderChatItem({ chat: chatWithMessage });
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      `You: ${chatAndMessageHelpers.sliceLatestMessage(message)}`
    );
  });

  test("displays text message from another user correctly", () => {
    const message = "Hello there";
    const senderName = "Jane Smith";
    const chatWithMessage = {
      ...mockChatData,
      messages: [
        {
          ...mockChatData.messages[0],
          type: "text",
          content: message,
          sender: { id: "another-user", name: senderName },
        },
      ],
    };

    renderChatItem({ chat: chatWithMessage });
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      `${senderName}: ${chatAndMessageHelpers.sliceLatestMessage(message)}`
    );
  });

  test("displays image message from current user correctly", () => {
    const chatWithImage = {
      ...mockChatData,
      messages: [
        {
          ...mockChatData.messages[0],
          type: "singleImage",
          content: "image-url",
          sender: { id: userData.id, name: userData.name },
        },
      ],
    };

    renderChatItem({ chat: chatWithImage });
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "You sent an image"
    );
  });

  test("displays image message from another user correctly", () => {
    const chatWithImage = {
      ...mockChatData,
      messages: [
        {
          ...mockChatData.messages[0],
          type: "singleImage",
          content: "image-url",
          sender: { id: "other-user-id", name: "John Doe" },
        },
      ],
    };

    renderChatItem({ chat: chatWithImage });
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "John Doe sent an image"
    );
  });
});
