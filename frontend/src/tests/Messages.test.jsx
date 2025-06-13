import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import { Messages } from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";

const { currentUserMock, findGroupChatByIdMock } = queryMocks;

const userData = currentUserMock.result.data.me;
const chatMessages = findGroupChatByIdMock.result.data.findChatById.messages;

Element.prototype.scrollIntoView = vi.fn();

const renderComponent = (mockChatMessages) => {
  render(<Messages user={userData} messages={mockChatMessages} />);
};

describe("<Message />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders current user message", () => {
    renderComponent(chatMessages);

    expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
  });

  test("renders empty state", () => {
    renderComponent([]);

    expect(screen.getByTestId("no-messages")).toBeInTheDocument();
    expect(
      screen.getByText("Send a message to start the chat.")
    ).toBeInTheDocument();
  });
});
