import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import NewChatModal from "../components/Modals/NewChatModal.jsx";
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
  findGroupChatByTitleNullMock,
  findGroupChatByTitleMock,
} = queryMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const user1 = allContactsByUserMock.result.data.allContactsByUser.contacts[0];
const user2 = allContactsByUserMock.result.data.allContactsByUser.contacts[1];

const mockSetShowNewChatModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (
  chatType,
  mockData = [
    currentUserMock,
    allContactsByUserMock,
    allContactsByUserSearchMock,
    findChatByMembersNullMock,
    findGroupChatByTitleNullMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <NewChatModal
          user={userData}
          chatType={chatType}
          setShowNewChatModal={mockSetShowNewChatModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewChatModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.clear();
  });

  describe("Private Chat Modal", () => {
    test("renders private chat modal", () => {
      renderComponent("private");

      expect(screen.getByTestId("new-private-chat-modal")).toBeInTheDocument();
      expect(screen.getByText("New Private Chat")).toBeInTheDocument();
    });

    test("search contacts works in private chat", async () => {
      const user = userEvent.setup();
      renderComponent("private");

      await waitFor(() => {
        expect(screen.getByTestId("search-contacts-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-contacts-input");
      await user.click(searchInput);
      await user.clear(searchInput);
      await user.paste(user1.name);

      await waitFor(() => {
        expect(screen.getByTestId("search-contacts-input")).toHaveValue(
          user1.name
        );
      });
    });

    test("closing private chat modal works", async () => {
      renderComponent("private");
      const user = userEvent.setup();

      await waitFor(() => {
        expect(
          screen.getByTestId("close-new-private-chat-modal")
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("close-new-private-chat-modal"));

      expect(mockSetShowNewChatModal).toHaveBeenCalledWith(false);
    });

    test("redirects to existing private chat when one exists", async () => {
      const user = userEvent.setup();
      renderComponent("private", [
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

      expect(mockSetShowNewChatModal).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(
        `/chats/${findPrivateChatByIdMock.result.data.findChatById.id}`
      );
      expect(mockSetShowNewChatModal).toHaveBeenCalledWith(false);
    });

    test("fails to start chat without selecting a contact", async () => {
      const user = userEvent.setup();
      renderComponent("private");

      await waitFor(() => {
        expect(
          screen.getByTestId("start-new-private-chat")
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("start-new-private-chat"));

      expect(
        screen.getByText("Please select a contact to create a chat with!")
      ).toBeInTheDocument();
    });

    test("fails to start chat with blocked contact", async () => {
      const user = userEvent.setup();
      renderComponent("private", [
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

      expect(
        screen.getByText("This user has blocked you!")
      ).toBeInTheDocument();
    });

    test("successfully starts new private chat", async () => {
      const user = userEvent.setup();
      renderComponent("private");

      await waitFor(() => {
        expect(
          screen.getByTestId(`contact-${user1.username}`)
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId(`contact-${user1.username}`));
      await user.click(screen.getByTestId("start-new-private-chat"));

      expect(mockSetShowNewChatModal).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/chats/new");
      expect(mockSetShowNewChatModal).toHaveBeenCalledWith(false);
    });
  });

  describe("Group Chat Modal", () => {
    test("renders group chat modal", () => {
      renderComponent("group");

      expect(screen.getByTestId("new-group-chat-modal")).toBeInTheDocument();
      expect(screen.getByText("New Group Chat")).toBeInTheDocument();
    });

    test("can type in group chat title and description inputs", async () => {
      const user = userEvent.setup();
      renderComponent("group");

      await waitFor(() => {
        expect(
          screen.getByTestId("group-chat-title-input")
        ).toBeInTheDocument();
      });

      const titleInput = screen.getByTestId("group-chat-title-input");
      const descriptionInput = screen.getByTestId(
        "group-chat-description-input"
      );

      await user.type(titleInput, "Test Group Chat");
      await user.type(descriptionInput, "This is a test group chat");

      expect(titleInput).toHaveValue("Test Group Chat");
      expect(descriptionInput).toHaveValue("This is a test group chat");
    });

    test("search contacts works in group chat", async () => {
      const user = userEvent.setup();
      renderComponent("group");

      await waitFor(() => {
        expect(screen.getByTestId("search-contacts-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-contacts-input");
      await user.click(searchInput);
      await user.clear(searchInput);
      await user.paste(user1.name);

      await waitFor(() => {
        expect(screen.getByTestId("search-contacts-input")).toHaveValue(
          user1.name
        );
      });
    });

    test("closing group chat modal works", async () => {
      renderComponent("group");
      const user = userEvent.setup();

      await waitFor(() => {
        expect(
          screen.getByTestId("close-new-group-chat-modal")
        ).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId("close-new-group-chat-modal");
      await user.click(closeButton);

      expect(mockSetShowNewChatModal).toHaveBeenCalledWith(false);
    });

    test("fails to start group chat without title", async () => {
      renderComponent("group");
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

    test("fails to start group chat with only one contact", async () => {
      const user = userEvent.setup();
      renderComponent("group");

      await waitFor(() => {
        expect(
          screen.getByTestId(`contact-${user1.username}`)
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId(`contact-${user1.username}`));

      expect(screen.getByText("1 contacts selected")).toBeInTheDocument();

      const titleInput = screen.getByTestId("group-chat-title-input");
      const descriptionInput = screen.getByTestId(
        "group-chat-description-input"
      );

      await user.type(titleInput, "Test Group Chat");
      await user.type(descriptionInput, "This is a test group chat");

      await user.click(screen.getByTestId("start-new-group-chat-button"));

      expect(
        screen.getByText(
          "Please select at least 2 contacts to create a group chat with!"
        )
      ).toBeInTheDocument();
    });

    test("fails to start group chat with existing title", async () => {
      const user = userEvent.setup();
      renderComponent("group", [
        currentUserMock,
        allContactsByUserMock,
        allContactsByUserSearchMock,
        findGroupChatByTitleMock,
      ]);

      await waitFor(() => {
        expect(
          screen.getByTestId(`contact-${user1.username}`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`contact-${user2.username}`)
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId(`contact-${user1.username}`));
      await user.click(screen.getByTestId(`contact-${user2.username}`));

      const titleInput = screen.getByTestId("group-chat-title-input");
      const descriptionInput = screen.getByTestId(
        "group-chat-description-input"
      );

      await user.type(titleInput, "Test Group Chat");
      await user.type(descriptionInput, "This is a test group chat");

      await user.click(screen.getByTestId("start-new-group-chat-button"));

      await waitFor(() => {
        expect(
          screen.getByText("Group chat with the same title already exists!")
        ).toBeInTheDocument();
      });
    });

    test("successfully starts new group chat", async () => {
      const user = userEvent.setup();
      renderComponent("group");

      await waitFor(() => {
        expect(
          screen.getByTestId(`contact-${user1.username}`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`contact-${user2.username}`)
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId(`contact-${user1.username}`));
      await user.click(screen.getByTestId(`contact-${user2.username}`));

      expect(screen.getByText("2 contacts selected")).toBeInTheDocument();

      const titleInput = screen.getByTestId("group-chat-title-input");
      const descriptionInput = screen.getByTestId(
        "group-chat-description-input"
      );

      await user.type(titleInput, "Test Group Chat");
      await user.type(descriptionInput, "This is a test group chat");

      await user.click(screen.getByTestId("start-new-group-chat-button"));

      expect(mockSetShowNewChatModal).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/chats/new");
      expect(mockSetShowNewChatModal).toHaveBeenCalledWith(false);
    });
  });

  describe("Shared functionality", () => {
    test("displays contacts count for group chat", async () => {
      const user = userEvent.setup();
      renderComponent("group");

      await waitFor(() => {
        expect(
          screen.getByTestId(`contact-${user1.username}`)
        ).toBeInTheDocument();
      });

      expect(screen.getByText("0 contacts selected")).toBeInTheDocument();

      await user.click(screen.getByTestId(`contact-${user1.username}`));
      expect(screen.getByText("1 contacts selected")).toBeInTheDocument();

      await user.click(screen.getByTestId(`contact-${user2.username}`));
      expect(screen.getByText("2 contacts selected")).toBeInTheDocument();
    });

    test("does not show group fields for private chat", () => {
      renderComponent("private");

      expect(
        screen.queryByTestId("group-chat-title-input")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("group-chat-description-input")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("contacts selected")).not.toBeInTheDocument();
    });

    test("shows group fields for group chat", async () => {
      renderComponent("group");

      await waitFor(() => {
        expect(
          screen.getByTestId("group-chat-title-input")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("group-chat-description-input")
        ).toBeInTheDocument();
        expect(screen.getByText("0 contacts selected")).toBeInTheDocument();
      });
    });
  });
});
