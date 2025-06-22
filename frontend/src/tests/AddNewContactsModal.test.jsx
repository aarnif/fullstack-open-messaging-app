import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import AddNewContactsModal from "../components/Modals/AddNewContactsModal.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  allContactsByUserMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
} = queryMocks;

const { addContactMock, addContactsMock } = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const user1 =
  allContactsExceptByUserMock.result.data.allContactsExceptByUser[0];
const user2 =
  allContactsExceptByUserMock.result.data.allContactsExceptByUser[1];

const mockSetShowAddNewContactsModal = vi.fn();

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
    allContactsExceptByUserMock,
    allContactsExceptByUserSearchMock,
    addContactMock,
    addContactsMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <AddNewContactsModal
          user={userData}
          setShowAddNewContactsModal={mockSetShowAddNewContactsModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<AddNewContactsModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("add-new-contacts-modal")).toBeInTheDocument();
    expect(screen.getByText("Add New Contacts")).toBeInTheDocument();
  });

  test("filters contacts by search input", async () => {
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

  test("displays error when no contacts selected", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("add-new-contacts-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("add-new-contacts-button"));

    expect(screen.getByTestId("notify-message")).toBeInTheDocument();
    expect(
      screen.getByText("Please select at least one contact to add!")
    ).toBeInTheDocument();
  });

  test("selects single contact successfully", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      allContactsByUserMock,
      allContactsExceptByUserMock,
      addContactMock,
    ]);

    await waitFor(() => {
      expect(
        screen.getByTestId(`contact-${user1.username}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`contact-${user1.username}`));

    expect(screen.getByText("1 contacts selected")).toBeInTheDocument();

    await user.click(screen.getByTestId("add-new-contacts-button"));

    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/contacts");
    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledWith(false);
  });

  test("selects multiple contacts successfully", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      allContactsByUserMock,
      allContactsExceptByUserMock,
      addContactsMock,
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

    expect(screen.getByText("2 contacts selected")).toBeInTheDocument();

    await user.click(screen.getByTestId("add-new-contacts-button"));

    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/contacts");
    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledWith(false);
  });
});
