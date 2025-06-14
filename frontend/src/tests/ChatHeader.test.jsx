import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import { ChatHeader } from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock, findPrivateChatByIdMock } =
  queryMocks;

const { navigate } = mocks;

const mockUserData = currentUserMock.result.data.me;
const mockGroupChatData = findGroupChatByIdMock.result.data.findChatById;
const mockPrivateChatData = findPrivateChatByIdMock.result.data.findChatById;

const mockSetShowGroupChatInfoModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderChatHeader = (mockChatData = mockGroupChatData) => {
  return render(
    <MockedProvider>
      <MemoryRouter>
        <ChatHeader
          user={mockUserData}
          chat={mockChatData}
          setShowGroupChatInfoModal={mockSetShowGroupChatInfoModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ChatHeader />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders header with correct title", () => {
    renderChatHeader();

    expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    expect(screen.getByText(mockGroupChatData.title)).toBeInTheDocument();
  });

  test("click go back button works", async () => {
    const user = userEvent.setup();
    renderChatHeader();

    await user.click(screen.getByTestId("go-back-button"));

    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("click group chat info button works", async () => {
    const user = userEvent.setup();
    renderChatHeader();

    await user.click(screen.getByTestId("chat-info-button"));

    expect(mockSetShowGroupChatInfoModal).toHaveBeenCalledWith(true);
  });

  test("click private chat info button navigates to contact page", async () => {
    const user = userEvent.setup();
    renderChatHeader(mockPrivateChatData);

    await user.click(screen.getByTestId("chat-info-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/contacts/${mockPrivateChatData.members[1].id}`
    );
  });
});
