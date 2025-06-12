import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useMatch } from "react-router";
import userEvent from "@testing-library/user-event";

import ModalProvider from "../components/ModalProvider.jsx";
import Contact from "../components/Contact.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  findUserByIdMock,
  findChatByMembersMock,
  allContactsByUserMock,
} = queryMocks;
const { blockOrUnblockContactMock, removeContactMock } = mutationMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const contactData = findUserByIdMock.result.data.findUserById;

const mockSetActiveMenuItem = vi.fn();
const match = findUserByIdMock.request.variables.id;
const existingChatId = findChatByMembersMock.result.data.findChatByMembers.id;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useMatch: vi.fn(),
  };
});

const renderComponent = (
  mockUserData = userData,
  mockData = [findUserByIdMock]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <Contact
            user={mockUserData}
            setActiveMenuItem={mockSetActiveMenuItem}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<Contact />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    useMatch.mockReturnValue({
      params: { contactId: match },
    });
  });

  test("renders component with loading state", () => {
    renderComponent();

    expect(screen.getByTestId("contact-page")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders component with contact after loading", async () => {
    renderComponent();

    expect(screen.getByTestId("contact-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("contact-info")).toBeInTheDocument();
      expect(
        screen.getByTestId("individual-contact-card-options")
      ).toBeInTheDocument();

      const chatWithContactButton = screen.queryByTestId(
        "chat-with-contact-button"
      );
      expect(chatWithContactButton).toBeInTheDocument();
      expect(chatWithContactButton).not.toHaveAttribute("disabled");
      expect(
        screen.getByTestId("block-or-unblock-contact-button")
      ).toBeInTheDocument();
      expect(screen.getByTestId("remove-contact-button")).toBeInTheDocument();
    });
  });

  test("Display you have blocked contact if true", async () => {
    const modifiedUserData = {
      ...userData,
      blockedContacts: [{ id: contactData.id }],
    };

    renderComponent(modifiedUserData);

    await waitFor(() => {
      expect(screen.getByTestId("contact-info")).toBeInTheDocument();
    });

    expect(
      screen.getByText("You have blocked this contact!")
    ).toBeInTheDocument();
  });

  test("Display contact has blocked you if true", async () => {
    const modifiedFindUserByIdMock = {
      ...findUserByIdMock,
      result: {
        ...findUserByIdMock.result,
        data: {
          findUserById: {
            ...findUserByIdMock.result.data.findUserById,
            blockedContacts: [{ id: userData.id }],
          },
        },
      },
    };

    renderComponent(userData, [modifiedFindUserByIdMock]);

    await waitFor(() => {
      expect(screen.getByTestId("contact-info")).toBeInTheDocument();
      const chatWithContactButton = screen.queryByTestId(
        "chat-with-contact-button"
      );

      expect(chatWithContactButton).toBeInTheDocument();
      expect(chatWithContactButton).toHaveAttribute("disabled");
    });

    expect(
      screen.getByText("This contact has blocked you!")
    ).toBeInTheDocument();
  });

  test("clicking back button navigates to contacts page", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contact-info")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("go-back-button"));

    expect(navigate).toHaveBeenCalledWith("/contacts");
  });

  test("click chat button directs to existing private chat", async () => {
    const user = userEvent.setup();
    renderComponent(userData, [
      findUserByIdMock,
      findChatByMembersMock,
      allContactsByUserMock,
    ]);

    let chatWithContactButton = null;

    await waitFor(() => {
      chatWithContactButton = screen.queryByTestId("chat-with-contact-button");
      expect(chatWithContactButton).toBeInTheDocument();
    });

    await user.click(chatWithContactButton);

    expect(navigate).toHaveBeenCalledWith(`/chats/${existingChatId}`);
  });

  test("click chat button directs to new private chat", async () => {
    const existingChatNotFound = {
      ...findChatByMembersMock,
      result: {
        ...findChatByMembersMock.result,
        data: {
          ...findChatByMembersMock.result.data,
          findChatByMembers: null,
        },
      },
    };
    const user = userEvent.setup();
    renderComponent(userData, [
      findUserByIdMock,
      existingChatNotFound,
      allContactsByUserMock,
    ]);

    let chatWithContactButton = null;

    await waitFor(() => {
      chatWithContactButton = screen.queryByTestId("chat-with-contact-button");
      expect(chatWithContactButton).toBeInTheDocument();
    });

    await user.click(chatWithContactButton);

    expect(navigate).toHaveBeenCalledWith("/chats/new");
  });

  test("click block contact button works", async () => {
    const user = userEvent.setup();
    renderComponent(userData, [
      findUserByIdMock,
      blockOrUnblockContactMock,
      allContactsByUserMock,
    ]);

    let blockContactButton = null;

    await waitFor(() => {
      blockContactButton = screen.getByTestId(
        "block-or-unblock-contact-button"
      );
      expect(blockContactButton).toBeInTheDocument();
    });

    await user.click(blockContactButton);
    await user.click(screen.getByTestId("confirm-button"));

    expect(
      screen.getByText("You have blocked this contact!")
    ).toBeInTheDocument();
  });

  test("click remove contact button works", async () => {
    const user = userEvent.setup();
    renderComponent(userData, [
      findUserByIdMock,
      removeContactMock,
      allContactsByUserMock,
    ]);

    let removeContactButton = null;

    await waitFor(() => {
      removeContactButton = screen.getByTestId("remove-contact-button");
      expect(removeContactButton).toBeInTheDocument();
    });

    await user.click(removeContactButton);
    await user.click(screen.getByTestId("confirm-button"));

    expect(navigate).toHaveBeenCalledWith("/contacts");
  });
});
