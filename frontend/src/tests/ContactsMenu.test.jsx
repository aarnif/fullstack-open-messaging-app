import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import ContactsMenu from "../components/ContactsMenu.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, allContactsByUserMock, allContactsByUserSearchMock } =
  queryMocks;

const { client, navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockHandleClickNewContact = vi.fn();
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
    allContactsByUserMock,
    allContactsByUserSearchMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ContactsMenu
          user={userData}
          handleClickNewContact={mockHandleClickNewContact}
          activeChatOrContactId={null}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ContactsMenu />", () => {
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
      expect(screen.getByTestId("contacts-menu")).toBeInTheDocument();
      expect(screen.getByTestId("menu-header")).toBeInTheDocument();
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

    renderComponent([currentUserMock, emptyAllContactsByUserMock]);

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

    renderComponent([
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
});
