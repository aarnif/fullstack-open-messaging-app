import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import ModalProvider from "../components/ModalProvider.jsx";
import ListMenu from "../components/ui/ListMenu.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import subscriptionMocks from "./mocks/subscriptionsMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  everyChatByUserMock,
  allContactsByUserMock,
  allContactsByUserSearchMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
} = queryMocks;

const { addContactsMock } = mutationMocks;

const {
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
} = subscriptionMocks;

const { client, navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockHandleClickCallback = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (
  menuType,
  mockData = [
    currentUserMock,
    everyChatByUserMock,
    allContactsByUserMock,
    allContactsByUserSearchMock,
    allContactsExceptByUserMock,
    allContactsExceptByUserSearchMock,
    addContactsMock,
    contactBlockedOrUnBlockedMock,
    groupChatEditedMock,
    newChatCreated,
    newMessageToChatAddedMock,
    leftGroupChatsMock,
    chatDeletedMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <ListMenu
            user={userData}
            menuType={menuType}
            handleClickCallback={mockHandleClickCallback}
            activeChatOrContactId={null}
            setActiveChatOrContactId={mockSetActiveChatOrContactId}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ListMenu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  describe("Chats Menu", () => {
    test("display loading state", () => {
      renderComponent("chats");

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    test("renders chats menu component", async () => {
      renderComponent("chats");

      await waitFor(() => {
        expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
        expect(screen.getByTestId("menu-header")).toBeInTheDocument();
        expect(screen.getByText("Chats")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Search chats by title...")
        ).toBeInTheDocument();
      });
    });

    test("displays no chats found message", async () => {
      const emptyEveryChatByUserMock = {
        request: {
          query: everyChatByUserMock.request.query,
          variables: everyChatByUserMock.request.variables,
        },
        result: {
          data: {
            everyChatByUser: [],
          },
        },
      };

      renderComponent("chats", [
        currentUserMock,
        emptyEveryChatByUserMock,
        allContactsExceptByUserMock,
        allContactsExceptByUserSearchMock,
        addContactsMock,
        contactBlockedOrUnBlockedMock,
        groupChatEditedMock,
        newChatCreated,
        newMessageToChatAddedMock,
        leftGroupChatsMock,
        chatDeletedMock,
      ]);

      await waitFor(() => {
        expect(screen.getByTestId("no-chats-found")).toBeInTheDocument();
        expect(screen.getByText("No chats found")).toBeInTheDocument();
      });
    });

    test("search chats works", async () => {
      const initialEveryChatByUserMock = {
        request: {
          query: everyChatByUserMock.request.query,
          variables: {
            searchByTitle: "",
          },
        },
        result: {
          data: {
            everyChatByUser: everyChatByUserMock.result.data.everyChatByUser,
          },
        },
      };

      const searchEveryChatByUserMock = {
        request: {
          query: everyChatByUserMock.request.query,
          variables: {
            searchByTitle: "Weekend Hikers",
          },
        },
        result: {
          data: {
            everyChatByUser: everyChatByUserMock.result.data.everyChatByUser,
          },
        },
      };

      const user = userEvent.setup();

      renderComponent("chats", [
        currentUserMock,
        initialEveryChatByUserMock,
        searchEveryChatByUserMock,
        allContactsExceptByUserMock,
        allContactsExceptByUserSearchMock,
        addContactsMock,
        contactBlockedOrUnBlockedMock,
        groupChatEditedMock,
        newChatCreated,
        newMessageToChatAddedMock,
        leftGroupChatsMock,
        chatDeletedMock,
      ]);

      const chatSearchInput = screen.getByTestId("chat-search-input");
      await user.click(chatSearchInput);
      await user.clear(chatSearchInput);
      await user.paste("Weekend Hikers");

      await waitFor(() => {
        expect(chatSearchInput).toHaveValue("Weekend Hikers");
      });
    });

    test("click new chat button works", async () => {
      const user = userEvent.setup();

      renderComponent("chats");

      await user.click(screen.getByTestId("new-chat-button"));

      expect(mockHandleClickCallback).toHaveBeenCalled();
    });
  });

  describe("Contacts Menu", () => {
    test("display loading state", () => {
      renderComponent("contacts");

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    test("renders contacts menu component", async () => {
      renderComponent("contacts");

      await waitFor(() => {
        expect(screen.getByTestId("contacts-menu")).toBeInTheDocument();
        expect(screen.getByTestId("menu-header")).toBeInTheDocument();
        expect(screen.getByText("Contacts")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Search contacts by name or username...")
        ).toBeInTheDocument();
      });
    });

    test("displays no contacts found message", async () => {
      const emptyAllContactsByUserMock = {
        request: {
          query: allContactsByUserMock.request.query,
          variables: allContactsByUserMock.request.variables,
        },
        result: {
          data: {
            allContactsByUser: { contacts: [] },
          },
        },
      };

      renderComponent("contacts", [
        currentUserMock,
        emptyAllContactsByUserMock,
      ]);

      await waitFor(() => {
        expect(screen.getByTestId("no-contacts-found")).toBeInTheDocument();
        expect(screen.getByText("No contacts found")).toBeInTheDocument();
      });
    });

    test("search contacts works", async () => {
      const initialAllContactsByUserMock = {
        request: {
          query: allContactsByUserMock.request.query,
          variables: {
            searchByName: "",
          },
        },
        result: {
          data: {
            allContactsByUser:
              allContactsByUserMock.result.data.allContactsByUser,
          },
        },
      };

      const searchAllContactsByUserMock = {
        request: {
          query: allContactsByUserMock.request.query,
          variables: {
            searchByName: "Alice Jones",
          },
        },
        result: {
          data: {
            allContactsByUser:
              allContactsByUserMock.result.data.allContactsByUser,
          },
        },
      };

      const user = userEvent.setup();

      renderComponent("contacts", [
        currentUserMock,
        initialAllContactsByUserMock,
        searchAllContactsByUserMock,
      ]);

      const contactSearchInput = screen.getByTestId("contact-search-input");
      await user.click(contactSearchInput);
      await user.clear(contactSearchInput);
      await user.paste("Alice Jones");

      await waitFor(() => {
        expect(contactSearchInput).toHaveValue("Alice Jones");
      });
    });

    test("click add new contacts works", async () => {
      const user = userEvent.setup();

      renderComponent("contacts");

      await user.click(screen.getByTestId("new-contact-button"));

      expect(mockHandleClickCallback).toHaveBeenCalled();
    });
  });
});
