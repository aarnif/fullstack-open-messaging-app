import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import ModalProvider from "../components/ModalProvider.jsx";
import { ChatHeader } from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock, findPrivateChatByIdMock } =
  queryMocks;

const { navigate } = mocks;

const mockUserData = currentUserMock.result.data.me;
const mockGroupChatData = findGroupChatByIdMock.result.data.findChatById;
const mockPrivateChatData = findPrivateChatByIdMock.result.data.findChatById;

const mockSetShowGroupChatInfo = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();
const mockHandleDeleteChat = vi.fn();

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
        <ModalProvider>
          <ChatHeader
            user={mockUserData}
            chat={mockChatData}
            setShowGroupChatInfo={mockSetShowGroupChatInfo}
            setActiveChatOrContactId={mockSetActiveChatOrContactId}
            handleDeleteChat={mockHandleDeleteChat}
          />
        </ModalProvider>
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

  test("navigates back to chats page on back button click", async () => {
    const user = userEvent.setup();
    renderChatHeader();

    await user.click(screen.getByTestId("go-back-button"));

    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("opens group chat info modal on button click", async () => {
    const user = userEvent.setup();
    renderChatHeader();

    await user.click(screen.getByTestId("chat-info-button"));

    expect(mockSetShowGroupChatInfo).toHaveBeenCalledWith(true);
  });

  test("navigates to contact page on private chat info button click", async () => {
    const user = userEvent.setup();
    renderChatHeader(mockPrivateChatData);

    await user.click(screen.getByTestId("chat-info-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/contacts/${mockPrivateChatData.members[1].id}`
    );
    expect(mockSetActiveChatOrContactId).toHaveBeenCalledWith(
      mockPrivateChatData.members[1].id
    );
  });
});
