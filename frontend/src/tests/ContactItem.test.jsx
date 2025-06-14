import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import { ContactItem } from "../components/ui/ListMenu.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findUserByIdMock } = queryMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const contactData = findUserByIdMock.result.data.findUserById;

const mockSetActiveChatOrContactId = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderContactItem = (activeChatOrContactId = contactData.id) => {
  return render(
    <MockedProvider mocks={[currentUserMock, findUserByIdMock]}>
      <MemoryRouter>
        <ContactItem
          user={userData}
          item={contactData}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<ContactItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders item with correct info", () => {
    renderContactItem();

    expect(screen.getByTestId("contact-card")).toBeInTheDocument();
    expect(screen.getByText(contactData.name)).toBeInTheDocument();
    expect(screen.getByText(`@${contactData.username}`)).toBeInTheDocument();
    expect(screen.getByText(contactData.about)).toBeInTheDocument();
  });

  test("highlights active contact", () => {
    renderContactItem();

    expect(screen.getByRole("button")).toHaveAttribute("id", "active-contact");
  });

  test("does not highlight inactive contact", () => {
    renderContactItem("inactive-contact-id");

    expect(screen.getByRole("button")).not.toHaveAttribute(
      "id",
      "active-contact"
    );
  });

  test("navigates to contact page on click", async () => {
    const user = userEvent.setup();
    renderContactItem();

    await user.click(screen.getByTestId(contactData.username));

    expect(navigate).toHaveBeenCalledWith(`/contacts/${contactData.id}`);
    expect(mockSetActiveChatOrContactId).toHaveBeenCalledWith(contactData.id);
  });
});
