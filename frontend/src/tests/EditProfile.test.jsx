import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import ModalProvider from "../components/ModalProvider.jsx";
import EditProfile from "../components/EditProfile.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock } = queryMocks;
const { editProfileMock } = mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetShowEditProfile = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (mockData = [currentUserMock, editProfileMock]) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <EditProfile
            user={userData}
            setShowEditProfile={mockSetShowEditProfile}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<EditProfile />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("edit-profile-modal")).toBeInTheDocument();
  });

  test("edit profile text works", async () => {
    const editProfileNameAndAboutMock = {
      request: {
        query: editProfileMock.request.query,
        variables: {
          name: "New Name",
          about: "This is User One profile. This is a new line.",
          input: {
            thumbnail: userData.image.thumbnail,
            original: userData.image.original,
          },
        },
      },
      result: {
        data: {
          editProfile: {
            ...userData,
            name: "New Name",
            about: "This is User One profile. This is a new line.",
            image: {
              ...userData.image,
              thumbnail: userData.image.thumbnail,
              original: userData.image.original,
            },
          },
        },
      },
    };
    const user = userEvent.setup();
    renderComponent([currentUserMock, editProfileNameAndAboutMock]);

    const profileNameInput = screen.getByTestId("profile-name-input");
    await user.clear(profileNameInput);
    await user.type(profileNameInput, "New Name");
    await user.type(
      screen.getByTestId("profile-about-input"),
      " This is a new line."
    );

    await user.click(screen.getByTestId("submit-edit-profile-button"));
    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockSetShowEditProfile).toHaveBeenCalledWith(false);
    });
  });

  test("edit profile with image works", async () => {
    const editProfileImageMock = {
      request: {
        query: editProfileMock.request.query,
        variables: {
          name: userData.name,
          about: userData.about,
          input: {
            thumbnail: userData.image.thumbnail,
            original: userData.image.original,
          },
        },
      },
      result: {
        data: {
          editProfile: userData,
        },
      },
    };

    const user = userEvent.setup();
    const file = new File(["new_profile_image"], "new_profile_image.png", {
      type: "image/png",
    });

    renderComponent([currentUserMock, editProfileImageMock]);

    await user.click(screen.getByTestId("change-image-button"));
    await user.upload(screen.getByTestId("change-image-input"), file);

    await user.click(screen.getByTestId("submit-edit-profile-button"));
    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockSetShowEditProfile).toHaveBeenCalledWith(false);
    });
  });

  test("edit profile with empty fields fails", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("submit-edit-profile-button"));

    const profileNameInput = screen.getByTestId("profile-name-input");

    await user.type(profileNameInput, "New Name");
    await user.clear(profileNameInput);

    await user.click(screen.getByTestId("submit-edit-profile-button"));

    expect(
      screen.getByText("Profile name cannot be empty!")
    ).toBeInTheDocument();
    expect(mockSetShowEditProfile).not.toHaveBeenCalled();
  });
});
