import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useLocation, useMatch } from "react-router";
import * as apolloClient from "@apollo/client";
import App from "../App.jsx";
import queryMocks from "./mocks/queryMocks.js";
import subscriptionMocks from "./mocks/subscriptionsMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserNullMock,
  currentUserMock,
  currentUserWithDarkModeMock,
  allChatsByUserMock,
  allContactsByUserMock,
  allContactsExceptByUserMock,
} = queryMocks;

const {
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
} = subscriptionMocks;

// const darkModeUserMock = {
//   ...currentUserMock,
//   result: {
//     ...currentUserMock.result,
//     data: {
//       ...currentUserMock.result.data,
//       me: {
//         ...currentUserMock.result.data.me,
//         settings: {
//           ...currentUserMock.result.data.me.settings,
//           theme: "dark",
//         },
//       },
//     },
//   },
// };

const darkModeUserMockData = [
  currentUserWithDarkModeMock,
  allChatsByUserMock,
  allContactsByUserMock,
  allContactsExceptByUserMock,
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
];

const userIsNotLoggedInMockData = [
  currentUserNullMock,
  allChatsByUserMock,
  allContactsByUserMock,
  allContactsExceptByUserMock,
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
];

const userIsLoggedInMockData = [
  currentUserMock,
  allChatsByUserMock,
  allContactsByUserMock,
  allContactsExceptByUserMock,
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
];

const { client, navigate } = mocks;

const userChats = allChatsByUserMock.result.data.allChatsByUser;
const userContacts =
  allContactsByUserMock.result.data.allContactsByUser.contacts;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useMatch: vi.fn(),
  };
});

const renderComponent = (
  mockData = userIsLoggedInMockData,
  routerProps = {}
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter {...routerProps}>
        <App />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    useLocation.mockReturnValue({
      pathname: "/",
    });
    useMatch.mockReturnValue({
      params: { chatId: "" },
    });
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("apply dark mode when user's theme is dark", async () => {
    renderComponent(darkModeUserMockData);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  test("display loading page", () => {
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("display front page after loading", async () => {
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("front-page")).toBeInTheDocument();
    });
  });

  test("redirects to signin page if not logged in", async () => {
    renderComponent(userIsNotLoggedInMockData);

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("sign-in-page")).toBeInTheDocument();
    });
  });

  test("navigate to signup page works", async () => {
    const user = userEvent.setup();
    renderComponent(userIsNotLoggedInMockData);

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("sign-in-page")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("sign-up-button"));

    expect(navigate).toHaveBeenCalledWith("/signup");
  });

  test("redirects to chats page if logged in", async () => {
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
    });
  });

  test("redirects unknown route to chats page if logged in", async () => {
    renderComponent(userIsLoggedInMockData, {
      initialEntries: ["/non-existent-route"],
    });
    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
    });
  });

  test("click navigate to contacts page works", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contacts-button"));

    expect(navigate).toHaveBeenCalledWith("/contacts");
  });

  test("click navigate to settings page works", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("settings-button"));

    expect(navigate).toHaveBeenCalledWith("/settings");
  });

  test("logout works", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("logout-button"));

    await waitFor(() => {
      expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("confirm-button"));
    expect(navigate).toHaveBeenCalledWith("/signin");
  });

  test("click navigate to individual chat page works", async () => {
    const user = userEvent.setup();
    const firstChat = userChats[0];
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
      expect(
        screen.getByTestId(`chat-item-${firstChat.id}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`chat-item-${firstChat.id}`));

    expect(navigate).toHaveBeenCalledWith(`/chats/${firstChat.id}`);
  });

  test("navigate to individual contact page works", async () => {
    const user = userEvent.setup();
    const firstContact = userContacts[0];
    renderComponent(userIsLoggedInMockData, {
      initialEntries: ["/contacts"],
    });

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
      expect(screen.getByTestId("contacts-menu")).toBeInTheDocument();
      expect(screen.getByTestId(firstContact.username)).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(firstContact.username));

    expect(navigate).toHaveBeenCalledWith(`/contacts/${firstContact.id}`);
  });

  test("click display new private chat modal works", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("new-chat-button"));

    await waitFor(() => {
      expect(screen.getByTestId("new-chat-dropdown-box")).toBeInTheDocument();
      expect(screen.getByTestId("new-private-chat-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("new-private-chat-button"));
  });

  test("click display new group chat modal works", async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("chats-page")).toBeInTheDocument();
      expect(screen.getByTestId("chats-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("new-chat-button"));

    await waitFor(() => {
      expect(screen.getByTestId("new-chat-dropdown-box")).toBeInTheDocument();
      expect(screen.getByTestId("new-group-chat-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("new-group-chat-button"));
  });

  test("click display add new contacts modal works", async () => {
    const user = userEvent.setup();
    renderComponent(userIsLoggedInMockData, {
      initialEntries: ["/contacts"],
    });

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
      expect(screen.getByTestId("contacts-menu")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("new-contact-button"));

    await waitFor(() => {
      expect(screen.getByTestId("add-new-contacts-modal")).toBeInTheDocument();
    });
  });
});
