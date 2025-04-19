import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import ChatItem from "../components/Chats/ChatItem.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

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

const renderChatItem = (
  chatData = mockChatData,
  activeChatOrContactId = chatData.id
) => {
  return render(
    <MockedProvider mocks={[currentUserMock, findGroupChatByIdMock]}>
      <MemoryRouter>
        <ChatItem
          index={0}
          user={userData}
          item={chatData}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ContactItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders item with correct info", () => {
    renderChatItem();

    expect(screen.getByTestId("chat-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("chat-card")).toBeInTheDocument();
    expect(screen.getByText(mockChatData.title)).toBeInTheDocument();
    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });

  test("displays no messages if no messages exist", () => {
    const emptyChatData = {
      ...mockChatData,
      messages: [],
    };
    renderChatItem(emptyChatData);

    expect(screen.queryByText("No messages")).toBeInTheDocument();
  });

  test("highlights active contact", () => {
    renderChatItem();

    expect(screen.getByRole("button")).toHaveAttribute("id", "active-chat");
  });

  test("does not highlight inactive contact", () => {
    renderChatItem(mockChatData, "inactive-contact-id");

    expect(screen.getByRole("button")).not.toHaveAttribute(
      "id",
      "chat-contact"
    );
  });

  test("navigates to chat page on click", async () => {
    const user = userEvent.setup();
    renderChatItem();

    await user.click(screen.getByTestId("chat-item-0"));

    expect(navigate).toHaveBeenCalledWith(`/chats/${mockChatData.id}`);
    expect(mockSetActiveChatOrContactId).toHaveBeenCalledWith(mockChatData.id);
  });
});
