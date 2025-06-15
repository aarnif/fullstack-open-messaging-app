import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import { UpdateMembersModal } from "../components/EditGroupChat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const {
  findGroupChatByIdMock,
  allContactsByUserMock,
  allContactsByUserSearchMock,
} = queryMocks;

const { navigate } = mocks;

const chatData = findGroupChatByIdMock.result.data.findChatById;
const user1 = allContactsByUserMock.result.data.allContactsByUser.contacts[0];

const mockSetChosenUserIds = vi.fn();
const mockSetNewMemberIds = vi.fn();
const mockSetSjowUpdateMembersModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (
  mockData = [
    findGroupChatByIdMock,
    allContactsByUserMock,
    allContactsByUserSearchMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <UpdateMembersModal
          chat={chatData}
          chosenUserIds={chatData.members.map((member) => member.id)}
          setChosenUserIds={mockSetChosenUserIds}
          setNewMemberIds={mockSetNewMemberIds}
          setShowUpdateMembersModal={mockSetSjowUpdateMembersModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<UpdateMembersModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();
    expect(screen.getByTestId("update-members-modal")).toBeInTheDocument();
  });

  test("cancel update members works", async () => {
    renderComponent();

    await userEvent.click(
      screen.getByTestId("close-update-members-modal-button")
    );

    expect(mockSetSjowUpdateMembersModal).toHaveBeenCalledWith(false);
    expect(mockSetChosenUserIds).toHaveBeenCalledWith([
      ...chatData.members.map((member) => member.id),
    ]);
  });

  test("update members works", async () => {
    renderComponent();

    await userEvent.click(
      screen.getByTestId("submit-update-group-chat-members-button")
    );

    expect(mockSetSjowUpdateMembersModal).toHaveBeenCalledWith(false);
    expect(mockSetNewMemberIds).toHaveBeenCalledWith(
      chatData.members.map((member) => member.id)
    );
  });

  test("search contacts work", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("search-contacts-input")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-contacts-input");
    await user.click(searchInput);
    await user.clear(searchInput);
    await user.paste(user1.name); // Paste the text because the query fetches character by character

    await waitFor(() => {
      expect(screen.getByTestId("search-contacts-input")).toHaveValue(
        user1.name
      );
    });
  });
});
