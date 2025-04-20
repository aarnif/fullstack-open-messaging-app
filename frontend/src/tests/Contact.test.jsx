import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate, useMatch } from "react-router";
import userEvent from "@testing-library/user-event";

import Contact from "../components/Contact.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findUserByIdMock } = queryMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const contactData = findUserByIdMock.result.data.findUserById;

const mockSetActiveMenuItem = vi.fn();
const mockModal = vi.fn();
const match = findUserByIdMock.request.variables.id;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useMatch: vi.fn(),
  };
});

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: mockModal,
  }),
}));

const renderComponent = (
  mockUserData = userData,
  mockContactData = findUserByIdMock
) => {
  render(
    <MockedProvider mocks={[mockContactData]}>
      <MemoryRouter>
        <Contact
          user={mockUserData}
          setActiveMenuItem={mockSetActiveMenuItem}
        />
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

    renderComponent(userData, modifiedFindUserByIdMock);

    await waitFor(() => {
      expect(screen.getByTestId("contact-info")).toBeInTheDocument();
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
});
