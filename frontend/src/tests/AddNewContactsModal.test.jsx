import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import AddNewContactsModal from "../components/Modals/AddNewContactsModal.jsx";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
  addContactsMock,
} = mockData;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetShowAddNewContactsModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = () => {
  render(
    <MockedProvider
      mocks={[
        currentUserMock,
        allContactsExceptByUserMock,
        allContactsExceptByUserSearchMock,
        addContactsMock,
      ]}
    >
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

  test("display error if no contacts selected", async () => {
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

  test("select one contact work", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contact-techie_alice")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contact-techie_alice"));

    expect(screen.getByText("1 contacts selected")).toBeInTheDocument();

    await user.click(screen.getByTestId("add-new-contacts-button"));

    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/contacts");
    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledWith(false);
  });

  test("select several contacts work", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contact-techie_alice")).toBeInTheDocument();
      expect(screen.getByTestId("contact-music_bob")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("contact-techie_alice"));
    await user.click(screen.getByTestId("contact-music_bob"));

    expect(screen.getByText("2 contacts selected")).toBeInTheDocument();

    await user.click(screen.getByTestId("add-new-contacts-button"));

    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/contacts");
    expect(mockSetShowAddNewContactsModal).toHaveBeenCalledWith(false);
  });
});
