import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import EditProfileModal from "../components/Modals/EditProfileModal.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock } = queryMocks;
const { editProfileMock } = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockModal = vi.fn();
const mockSetShowEditProfileModal = vi.fn();

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

const renderComponent = () => {
  render(
    <MockedProvider mocks={[currentUserMock, editProfileMock]}>
      <MemoryRouter>
        <EditProfileModal
          user={userData}
          setShowEditProfileModal={mockSetShowEditProfileModal}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<EditProfileModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("edit-profile-modal")).toBeInTheDocument();
  });

  test("edit profile text works", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByTestId("profile-name-input"), "New Name");
    await user.type(screen.getByTestId("profile-about-input"), "New About");

    await user.click(screen.getByTestId("submit-edit-profile-button"));

    await waitFor(() => {
      expect(mockModal).toHaveBeenCalled();
    });
  });

  test("edit profile with image works", async () => {
    const user = userEvent.setup();
    const file = new File(["test"], "test.png", { type: "image/png" });
    renderComponent();

    await user.click(screen.getByTestId("change-image-button"));
    await user.upload(screen.getByTestId("change-image-input"), file);

    await user.click(screen.getByTestId("submit-edit-profile-button"));

    await waitFor(() => {
      expect(mockModal).toHaveBeenCalled();
    });
  });

  test("edit profile with empty fields fails", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("submit-edit-profile-button"));

    const profileNameInput = screen.getByTestId("profile-name-input");

    await user.type(profileNameInput, "New Name");
    await user.clear(profileNameInput);

    await waitFor(() => {
      expect(mockModal).toHaveBeenCalled();
    });
  });
});
