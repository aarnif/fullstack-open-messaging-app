import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import { Message } from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";

const { currentUserMock, findGroupChatByIdMock } = queryMocks;

const userData = currentUserMock.result.data.me;
const chatMessages = findGroupChatByIdMock.result.data.findChatById.messages;

const renderComponent = (mockMessage = "") => {
  render(<Message user={userData} message={mockMessage} />);
};

describe("<Message />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders current user message", () => {
    const currentUserMessage = {
      ...chatMessages[0],
      sender: {
        ...chatMessages[0].sender,
        id: userData.id,
      },
    };

    renderComponent(currentUserMessage);

    expect(screen.getByTestId("message-by-current-user")).toBeInTheDocument();
  });

  test("renders another user message", () => {
    const anotherUserMessage = {
      ...chatMessages[0],
      sender: {
        ...chatMessages[0].sender,
        id: "anotherUserId",
      },
    };
    renderComponent(anotherUserMessage);

    expect(screen.getByTestId("message-by-another-user")).toBeInTheDocument();
  });

  test("renders notification message", () => {
    const notificationMessage = {
      ...chatMessages[0],
      type: "notification",
    };

    renderComponent(notificationMessage);

    expect(screen.getByTestId("notification-message")).toBeInTheDocument();
  });

  test("renders current user message with image", () => {
    const messageWithImage = {
      ...chatMessages[0],
      image: {
        thumbnail: "thumbnail.jpg",
        original: "original.jpg",
      },
    };

    renderComponent(messageWithImage);

    expect(screen.getByTestId("message-by-current-user")).toBeInTheDocument();
    expect(
      screen.getByTestId("show-fullscreen-view-button")
    ).toBeInTheDocument();
  });

  test("renders another user message with image", () => {
    const anotherUserMessageWithImage = {
      ...chatMessages[0],
      sender: {
        ...chatMessages[0].sender,
        id: "anotherUserId",
      },
      image: {
        thumbnail: "thumbnail.jpg",
        original: "original.jpg",
      },
    };

    renderComponent(anotherUserMessageWithImage);

    expect(screen.getByTestId("message-by-another-user")).toBeInTheDocument();
    expect(
      screen.getByTestId("show-fullscreen-view-button")
    ).toBeInTheDocument();
  });

  test("renders current user message with emoji", () => {
    const messageWithEmoji = {
      ...chatMessages[0],
      type: "singleEmoji",
      content: "😊",
    };

    renderComponent(messageWithEmoji);

    expect(screen.getByTestId("message-by-current-user")).toBeInTheDocument();
  });

  test("renders another user message with emoji", () => {
    const anotherUserMessageWithEmoji = {
      ...chatMessages[0],
      sender: {
        ...chatMessages[0].sender,
        id: "anotherUserId",
      },
      type: "singleEmoji",
      content: "😊",
    };

    renderComponent(anotherUserMessageWithEmoji);

    expect(screen.getByTestId("message-by-another-user")).toBeInTheDocument();
  });
});
