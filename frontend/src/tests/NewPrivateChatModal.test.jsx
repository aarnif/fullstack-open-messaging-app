import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import NewPrivateChatModal from "../components/Modals/NewPrivateChatModal/NewPrivateChatModal.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  findPrivateChatByIdMock,
  allContactsByUserMock,
  allContactsByUserSearchMock,
  findChatByMembersNullMock,
  findChatByMembersMock,
  checkIfUserHasBlockedYouTrueMock,
} = queryMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const user1 = allContactsByUserMock.result.data.allContactsByUser.contacts[0];

const mockSetShowNewPrivateChatModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (
  mockData = [
    currentUserMock,
    findPrivateChatByIdMock,
    allContactsByUserMock,
    allContactsByUserSearchMock,
    findChatByMembersNullMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <NewPrivateChatModal
          user={userData}
          setShowNewPrivateChatModal={mockSetShowNewPrivateChatModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewPrivateChatModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.clear();
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("new-private-chat-modal")).toBeInTheDocument();
  });

  test("search contacts works", async () => {
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

  test("closing modal works", async () => {
    renderComponent();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(
        screen.getByTestId("close-new-private-chat-modal")
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("close-new-private-chat-modal"));

    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledWith(false);
  });

  test("click new private chat redirects to existing private chat", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      allContactsByUserMock,
      allContactsByUserSearchMock,
      findChatByMembersMock,
    ]);

    await waitFor(() => {
      expect(
        screen.getByTestId(`contact-${user1.username}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`contact-${user1.username}`));

    await user.click(screen.getByTestId("start-new-private-chat"));

    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      `/chats/${findPrivateChatByIdMock.result.data.findChatById.id}`
    );
    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledWith(false);
  });

  test("start chat without selecting a contact fails", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("start-new-private-chat")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("start-new-private-chat"));

    expect(
      screen.getByText("Please select a contact to create a chat with!")
    ).toBeInTheDocument();
  });

  test("start chat with a blocked contact fails", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      allContactsByUserMock,
      allContactsByUserSearchMock,
      findChatByMembersNullMock,
      checkIfUserHasBlockedYouTrueMock,
    ]);

    await waitFor(() => {
      expect(
        screen.getByTestId(`contact-${user1.username}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`contact-${user1.username}`));

    await user.click(screen.getByTestId("start-new-private-chat"));

    expect(screen.getByText("This user has blocked you!")).toBeInTheDocument();
  });

  test("start chat with a contact works", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByTestId(`contact-${user1.username}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`contact-${user1.username}`));

    await user.click(screen.getByTestId("start-new-private-chat"));

    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/chats/new");
    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledWith(false);
  });
});
