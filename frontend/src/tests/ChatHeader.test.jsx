import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import ChatHeader from "../components/Chat/ChatHeader.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock } = queryMocks;

const { navigate } = mocks;

const mockUserData = currentUserMock.result.data.me;
const mockChatData = findGroupChatByIdMock.result.data.findChatById;

const mockSetShowChatInfoModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderChatHeader = () => {
  return render(
    <MockedProvider>
      <MemoryRouter>
        <ChatHeader
          user={mockUserData}
          chat={mockChatData}
          setShowChatInfoModal={mockSetShowChatInfoModal}
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

  test("renders header with correct title", () => {
    renderChatHeader();

    expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    expect(screen.getByText(mockChatData.title)).toBeInTheDocument();
  });

  test("click go back button works", async () => {
    const user = userEvent.setup();
    renderChatHeader();

    await user.click(screen.getByTestId("go-back-button"));

    expect(navigate).toHaveBeenCalledWith("/chats");
  });
});
