import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import ModalProvider from "../components/ModalProvider.jsx";
import userEvent from "@testing-library/user-event";
import EditGroupChat from "../components/EditGroupChat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";
import mutationMocks from "./mocks/mutationMocks.js";

const {
  currentUserMock,
  findGroupChatByIdMock,
  allContactsByUserMock,
  allContactsByUserMockWithoutSearchWord,
} = queryMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const chatData = findGroupChatByIdMock.result.data.findChatById;

const { editGroupChatMock } = mutationMocks;

const mockSetShowEditGroupChat = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (
  mockDataArray = [
    currentUserMock,
    allContactsByUserMock,
    allContactsByUserMockWithoutSearchWord,
    findGroupChatByIdMock,
    editGroupChatMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockDataArray}>
      <MemoryRouter>
        <ModalProvider>
          <EditGroupChat
            user={userData}
            chat={chatData}
            chatAdmin={userData}
            setShowEditGroupChat={mockSetShowEditGroupChat}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<EditGroupChat />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();
    expect(screen.getByTestId("edit-group-chat-modal")).toBeInTheDocument();
  });

  test("can type in chat title and description inputs", async () => {
    const user = userEvent.setup();
    renderComponent();

    const titleInput = await screen.findByTestId("edit-group-chat-title-input");
    const descriptionInput = await screen.findByTestId(
      "edit-group-chat-description-input"
    );

    await user.clear(titleInput);
    await user.clear(descriptionInput);

    await user.type(titleInput, "New Chat Title");
    await user.type(descriptionInput, "New Chat Description");

    expect(titleInput.value).toBe("New Chat Title");
    expect(descriptionInput.value).toBe("New Chat Description");
  });

  test("go back button works", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("close-edit-group-chat-modal-button"));

    expect(mockSetShowEditGroupChat).toHaveBeenCalledWith(false);
  });

  test("shows error message if chat title is empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const titleInput = await screen.findByTestId("edit-group-chat-title-input");
    const descriptionInput = await screen.findByTestId(
      "edit-group-chat-description-input"
    );

    await user.clear(titleInput);
    await user.clear(descriptionInput);

    await user.click(screen.getByTestId("edit-group-chat-submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Please enter chat title")).toBeInTheDocument();
    });
  });

  test("click update members button works", async () => {
    const user = userEvent.setup();
    renderComponent();

    const updateMembersButton = await screen.findByTestId(
      "update-group-chat-members-button"
    );
    await user.click(updateMembersButton);

    await waitFor(() => {
      expect(screen.getByTestId("update-members-modal")).toBeInTheDocument();
      expect(screen.getByText("Update Members")).toBeInTheDocument();
    });
  });

  test("calls modal confirmation when submitting valid form", async () => {
    const user = userEvent.setup();
    renderComponent();

    const titleInput = await screen.findByTestId("edit-group-chat-title-input");
    const descriptionInput = await screen.findByTestId(
      "edit-group-chat-description-input"
    );
    const submitButton = await screen.findByTestId(
      "edit-group-chat-submit-button"
    );

    await user.clear(titleInput);
    await user.clear(descriptionInput);
    await user.type(titleInput, "Updated Chat Title");
    await user.type(descriptionInput, "Updated Chat Description");

    await user.click(submitButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to edit the chat information?")
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-button"));

    expect(mockSetShowEditGroupChat).toHaveBeenCalledWith(false);
  });
});
