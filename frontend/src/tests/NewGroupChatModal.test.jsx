import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider, wait } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import NewGroupChatModal from "../components/Modals/NewGroupChatModal.jsx";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  allContactsByUserMock,
  allContactsByUserSearchMock,
  findGroupChatByTitleNullMock,
  findGroupChatByTitleMock,
} = mockData;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetShowNewGroupChatModal = vi.fn();

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
    allContactsByUserMock,
    allContactsByUserSearchMock,
    findGroupChatByTitleNullMock,
    findGroupChatByTitleMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <NewGroupChatModal
          user={userData}
          setShowNewGroupChatModal={mockSetShowNewGroupChatModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewGroupChatModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.clear();
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("new-group-chat-modal")).toBeInTheDocument();
  });

  test("can type in group chat title and description inputs", async () => {
    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("group-chat-title-input")).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("group-chat-title-input");
    const descriptionInput = screen.getByTestId("group-chat-description-input");

    await user.type(titleInput, "Test Group Chat");
    await user.type(descriptionInput, "This is a test group chat");

    expect(titleInput).toHaveValue("Test Group Chat");
    expect(descriptionInput).toHaveValue("This is a test group chat");
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
    await user.paste("Alice Jones"); // Paste the text because the query fetches character by character

    await waitFor(() => {
      expect(screen.getByTestId("search-contacts-input")).toHaveValue(
        "Alice Jones"
      );
    });
  });

  test("closing modal works", async () => {
    renderComponent();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(
        screen.getByTestId("close-new-group-chat-modal")
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId("close-new-group-chat-modal");
    await user.click(closeButton);

    expect(mockSetShowNewGroupChatModal).toHaveBeenCalledWith(false);
  });

  test("click new group chat fails without chat 'title' ", async () => {
    renderComponent();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(
        screen.getByTestId("start-new-group-chat-button")
      ).toBeInTheDocument();
    });

    const startButton = screen.getByTestId("start-new-group-chat-button");
    await user.click(startButton);

    expect(
      screen.getByText("Please enter a group chat title!")
    ).toBeInTheDocument();
  });

  test("click new group chat fails with one contact", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contact-techie_alice")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contact-techie_alice"));

    expect(screen.getByText("1 contacts selected")).toBeInTheDocument();

    const titleInput = screen.getByTestId("group-chat-title-input");
    const descriptionInput = screen.getByTestId("group-chat-description-input");

    await user.type(titleInput, "Test Group Chat");
    await user.type(descriptionInput, "This is a test group chat");

    await user.click(screen.getByTestId("start-new-group-chat-button"));

    expect(
      screen.getByText(
        "Please select at least 2 contacts to create a group chat with!"
      )
    ).toBeInTheDocument();
  });

  test("click new group chat fails with existing group chat title", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      allContactsByUserMock,
      allContactsByUserSearchMock,
      findGroupChatByTitleMock,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId("contact-techie_alice")).toBeInTheDocument();
      expect(screen.getByTestId("contact-music_bob")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contact-techie_alice"));
    await user.click(screen.getByTestId("contact-music_bob"));

    const titleInput = screen.getByTestId("group-chat-title-input");
    const descriptionInput = screen.getByTestId("group-chat-description-input");

    await user.type(titleInput, "Test Group Chat");
    await user.type(descriptionInput, "This is a test group chat");

    await user.click(screen.getByTestId("start-new-group-chat-button"));

    await waitFor(() => {
      expect(
        screen.getByText("Group chat with the same title already exists!")
      ).toBeInTheDocument();
    });
  });

  test("start chat with several contacts work", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contact-techie_alice")).toBeInTheDocument();
      expect(screen.getByTestId("contact-music_bob")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contact-techie_alice"));
    await user.click(screen.getByTestId("contact-music_bob"));

    expect(screen.getByText("2 contacts selected")).toBeInTheDocument();

    const titleInput = screen.getByTestId("group-chat-title-input");
    const descriptionInput = screen.getByTestId("group-chat-description-input");

    await user.type(titleInput, "Test Group Chat");
    await user.type(descriptionInput, "This is a test group chat");

    await user.click(screen.getByTestId("start-new-group-chat-button"));

    expect(mockSetShowNewGroupChatModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/chats/new");
    expect(mockSetShowNewGroupChatModal).toHaveBeenCalledWith(false);
  });
});
