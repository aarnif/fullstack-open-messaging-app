import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import EditGroupChatModal from "../components/Modals/EditGroupChatModal/EditGroupChatModal.jsx";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, allContactsByUserMock, groupChatMock } = mockData;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const chatData = groupChatMock.result.data.findChatById;

const mockModal = vi.fn();
const mockShowEditGroupChatModal = vi.fn();

const allContactsByUserMockWithoutSearchWord = {
  ...allContactsByUserMock,
  request: {
    ...allContactsByUserMock.request,
    variables: {}, // ensure no variables are being passed
  },
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: mockModal,
  }),
}));

const renderComponent = (
  mockDataArray = [
    currentUserMock,
    allContactsByUserMock,
    allContactsByUserMockWithoutSearchWord,
    groupChatMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockDataArray}>
      <MemoryRouter>
        <EditGroupChatModal
          user={userData}
          chat={chatData}
          chatAdmin={userData}
          showEditGroupChatModal={mockShowEditGroupChatModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<EditGroupChatModal />", () => {
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

    expect(mockShowEditGroupChatModal).toHaveBeenCalledWith(false);
  });

  test("shows error messages when inputs are empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const titleInput = await screen.findByTestId("edit-group-chat-title-input");
    const descriptionInput = await screen.findByTestId(
      "edit-group-chat-description-input"
    );

    await user.clear(titleInput);
    await user.clear(descriptionInput);

    expect(screen.getByText("Please enter chat title")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter chat description")
    ).toBeInTheDocument();
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

    expect(mockModal).toHaveBeenCalledWith(
      "success",
      "Edit Chat",
      "Are you sure you want to edit the chat information?",
      "Edit",
      expect.any(Function)
    );
  });
});
