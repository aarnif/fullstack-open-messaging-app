import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useMatch } from "react-router";
import userEvent from "@testing-library/user-event";

import GroupChatInfoModal from "../components/Modals/GroupChatInfoModal/GroupChatInfoModal.jsx";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  groupChatMock,
  allContactsByUserMock,
  allContactsByUserMockWithoutSearchWord,
} = mockData;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const anotherUserData =
  allContactsByUserMock.result.data.allContactsByUser.contacts[0];
const chatData = groupChatMock.result.data.findChatById;

const mockSetShowChatInfoModal = vi.fn();
const mockModal = vi.fn();

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

const renderComponent = (mockUserData = userData, mockChatData = chatData) => {
  render(
    <MockedProvider
      mocks={[
        currentUserMock,
        groupChatMock,
        allContactsByUserMock,
        allContactsByUserMockWithoutSearchWord,
      ]}
      addTypename={false}
    >
      <MemoryRouter>
        <GroupChatInfoModal
          user={mockUserData}
          chat={mockChatData}
          setShowChatInfoModal={mockSetShowChatInfoModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<GroupChatInfoModal />", () => {
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
      ...groupChatMock.result.data.findChatById,
      description: "",
    };
    renderComponent(userData, groupChatDataWithoutDescriptionMock);

    expect(screen.getByTestId("group-chat-info-modal")).toBeInTheDocument();
    expect(screen.getByText(chatData.title)).toBeInTheDocument();
    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  test("click close modal works", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("close-group-chat-info-button"));

    expect(mockSetShowChatInfoModal).toHaveBeenCalledWith(false);
  });

  test("click edit group chat works", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("edit-group-chat-button"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-group-chat-modal")).toBeInTheDocument();
    });
  });

  test("do not display leave button if user is chat admin", () => {
    renderComponent();

    expect(
      screen.queryByTestId("leave-group-chat-button")
    ).not.toBeInTheDocument();
  });

  test("click leave group chat displays modal", async () => {
    const user = userEvent.setup();

    renderComponent(anotherUserData);

    await user.click(screen.getByTestId("leave-group-chat-button"));

    expect(mockModal).toHaveBeenCalledWith(
      "danger",
      "Leave Chat",
      "Are you sure you want to leave the chat?",
      "Leave",
      expect.any(Function)
    );
  });
});
