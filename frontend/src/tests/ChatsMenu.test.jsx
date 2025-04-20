import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import ChatsMenu from "../components/ChatsMenu.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import subscriptionMocks from "./mocks/subscriptionsMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  allChatsByUserMock,
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

const mockHandleClickNewChat = vi.fn();
const mockSetActiveMenuItem = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();

const mockModal = vi.fn();

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
  mockData = [
    currentUserMock,
    allChatsByUserMock,
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
        <ChatsMenu
          user={userData}
          handleClickNewChat={mockHandleClickNewChat}
          activeChatOrContactId={mockSetActiveMenuItem}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ChatsMenu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("display loading state", () => {
    renderComponent();

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders component", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
      expect(screen.getByTestId("menu-header")).toBeInTheDocument();
    });
  });

  test("displays no chats found message", async () => {
    const emptyAllChatsByUserMock = {
      request: {
        query: allChatsByUserMock.request.query,
        variables: allChatsByUserMock.request.variables,
      },
      result: {
        data: {
          allChatsByUser: [],
        },
      },
    };

    renderComponent([
      currentUserMock,
      emptyAllChatsByUserMock,
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
    const initialAllChatsByUserMock = {
      request: {
        query: allChatsByUserMock.request.query,
        variables: {
          searchByTitle: "",
        },
      },
      result: {
        data: {
          allChatsByUser: allChatsByUserMock.result.data.allChatsByUser,
        },
      },
    };

    const searchAllChatsByUserMock = {
      request: {
        query: allChatsByUserMock.request.query,
        variables: {
          searchByTitle: "Weekend Hikers",
        },
      },
      result: {
        data: {
          allChatsByUser: allChatsByUserMock.result.data.allChatsByUser,
        },
      },
    };

    const user = userEvent.setup();

    renderComponent([
      currentUserMock,
      initialAllChatsByUserMock,
      searchAllChatsByUserMock,
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
});
