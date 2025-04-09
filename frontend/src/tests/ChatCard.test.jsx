import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ChatCard from "../components/Chats/ChatCard.jsx";
import mockData from "./mocks/data.js";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers.js";

const { currentUserMock, findChatByIdMock } = mockData;

const userData = currentUserMock.result.data.me;
const chatData = findChatByIdMock.result.data.findChatById;

describe("<ChatCard />", () => {
  test("renders chat with correct info", () => {
    render(<ChatCard user={userData} chat={chatData} />);

    expect(screen.getByTestId("chat-card")).toBeInTheDocument();
    expect(screen.getByText(chatData.title)).toBeInTheDocument();
  });

  test("do not display new messages count if count zero", () => {
    render(<ChatCard user={userData} chat={chatData} />);
    expect(screen.queryByTestId("new-messages-count")).not.toBeInTheDocument();
  });

  test("displays new messages count if count greater than zero", () => {
    const chatWithNewMessages = {
      ...chatData,
      messages: [
        ...chatData.messages,
        {
          ...chatData.messages[0],
          sender: { id: userData.id },
          isReadBy: [{ isRead: false, member: { id: userData.id } }],
        },
      ],
    };
    render(<ChatCard user={userData} chat={chatWithNewMessages} />);
    expect(screen.queryByTestId("new-messages-count")).toBeInTheDocument();
  });

  test("displays notification message correctly", () => {
    const chatWithNotification = {
      ...chatData,
      messages: [
        {
          ...chatData.messages[0],
          type: "notification",
          content: "User joined the chat",
          sender: { id: "someone-else", name: "Someone Else" },
        },
      ],
    };

    render(<ChatCard user={userData} chat={chatWithNotification} />);
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "User joined the chat"
    );
  });

  test("displays image message from current user correctly", () => {
    const chatWithImage = {
      ...chatData,
      messages: [
        {
          ...chatData.messages[0],
          type: "singleImage",
          content: "image-url",
          sender: { id: userData.id, name: userData.name },
        },
      ],
    };

    render(<ChatCard user={userData} chat={chatWithImage} />);
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "You sent an image"
    );
  });

  test("displays image message from another user correctly", () => {
    const chatWithImage = {
      ...chatData,
      messages: [
        {
          ...chatData.messages[0],
          type: "singleImage",
          content: "image-url",
          sender: { id: "other-user-id", name: "John Doe" },
        },
      ],
    };

    render(<ChatCard user={userData} chat={chatWithImage} />);
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      "John Doe sent an image"
    );
  });

  test("displays text message from current user correctly", () => {
    const message = "Hello world";
    const chatWithMessage = {
      ...chatData,
      messages: [
        {
          ...chatData.messages[0],
          type: "text",
          content: message,
          sender: { id: userData.id, name: userData.name },
        },
      ],
    };

    render(<ChatCard user={userData} chat={chatWithMessage} />);
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      `You: ${chatAndMessageHelpers.sliceLatestMessage(message)}`
    );
  });

  test("displays text message from another user correctly", () => {
    const message = "Hello there";
    const senderName = "Jane Smith";
    const chatWithMessage = {
      ...chatData,
      messages: [
        {
          ...chatData.messages[0],
          type: "text",
          content: message,
          sender: { id: "another-user", name: senderName },
        },
      ],
    };

    render(<ChatCard user={userData} chat={chatWithMessage} />);
    expect(screen.getByTestId("latest-chat-message")).toHaveTextContent(
      `${senderName}: ${chatAndMessageHelpers.sliceLatestMessage(message)}`
    );
  });
});
