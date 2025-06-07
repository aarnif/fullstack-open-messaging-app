import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import ModalProvider from "../components/ModalProvider.jsx";
import ChangePasswordModal from "../components/Modals/ChangePasswordModal.jsx";
import mutationMocks from "./mocks/mutationMocks.js";

const { changePasswordMock } = mutationMocks;

const mockSetShowChangePasswordModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (mockData = []) => {
  render(
    <MockedProvider mocks={mockData}>
      <ModalProvider>
        <ChangePasswordModal
          setShowChangePasswordModal={mockSetShowChangePasswordModal}
        />
      </ModalProvider>
    </MockedProvider>
  );
};

const typeChangePasswordInputs = async (
  user,
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  const currentPasswordInput = screen.getByTestId("current-password-input");
  const newPasswordInput = screen.getByTestId("new-password-input");
  const confirmNewPasswordInput = screen.getByTestId(
    "confirm-new-password-input"
  );
  await user.clear(currentPasswordInput);
  await user.type(currentPasswordInput, currentPassword);
  await user.clear(newPasswordInput);
  await user.type(newPasswordInput, newPassword);
  await user.clear(confirmNewPasswordInput);
  await user.type(confirmNewPasswordInput, confirmNewPassword);
  await user.click(screen.getByTestId("submit-change-password-button"));
};

describe("<ChangePasswordModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("change-password-modal")).toBeInTheDocument();
  });

  test("change password fails with empty fields", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("submit-change-password-button"));

    await waitFor(() => {
      expect(screen.getByTestId("notify-message")).toBeInTheDocument();
      expect(screen.getByTestId("notify-message")).toHaveTextContent(
        "Please fill in all fields"
      );
    });
  });

  test("change password fails with wrong current password", async () => {
    const user = userEvent.setup();
    const wrongPassword = "wrong_password";
    const errorMessage = "Incorrect current password";
    const wrongPasswordMock = {
      ...changePasswordMock,
      request: {
        ...changePasswordMock.request,
        variables: {
          ...changePasswordMock.request.variables,
          currentPassword: wrongPassword,
        },
      },
      result: {
        errors: [
          {
            message: errorMessage,
          },
        ],
      },
    };
    const { newPassword, confirmNewPassword } =
      changePasswordMock.request.variables;

    renderComponent([wrongPasswordMock]);

    await typeChangePasswordInputs(
      user,
      wrongPassword,
      newPassword,
      confirmNewPassword
    );

    await waitFor(() => {
      expect(screen.getByTestId("notify-message")).toBeInTheDocument();
      expect(screen.getByTestId("notify-message")).toHaveTextContent(
        errorMessage
      );
    });
  });

  test("change password fails with too short new password", async () => {
    const user = userEvent.setup();
    const tooShortPassword = "short";
    const errorMessage = "New password must be at least 6 characters long!";
    const tooShortPasswordMock = {
      ...changePasswordMock,
      request: {
        ...changePasswordMock.request,
        variables: {
          ...changePasswordMock.request.variables,
          newPassword: tooShortPassword,
          confirmNewPassword: tooShortPassword,
        },
      },
      result: {
        errors: [
          {
            message: errorMessage,
          },
        ],
      },
    };

    renderComponent([tooShortPasswordMock]);

    await typeChangePasswordInputs(
      user,
      changePasswordMock.request.variables.currentPassword,
      tooShortPassword,
      tooShortPassword
    );

    await waitFor(() => {
      expect(screen.getByTestId("notify-message")).toBeInTheDocument();
      expect(screen.getByTestId("notify-message")).toHaveTextContent(
        errorMessage
      );
    });
  });

  test("change password fails with new passwords not matching", async () => {
    const user = userEvent.setup();
    const { currentPassword, newPassword } =
      changePasswordMock.request.variables;
    const confirmNewPassword = "different_password";
    const errorMessage = "New passwords do not match!";
    const notMatchingPasswordsMock = {
      ...changePasswordMock,
      request: {
        ...changePasswordMock.request,
        variables: {
          ...changePasswordMock.request.variables,
          confirmNewPassword,
        },
      },
      result: {
        errors: [
          {
            message: errorMessage,
          },
        ],
      },
    };

    renderComponent([notMatchingPasswordsMock]);

    await typeChangePasswordInputs(
      user,
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    await waitFor(() => {
      expect(screen.getByTestId("notify-message")).toBeInTheDocument();
      expect(screen.getByTestId("notify-message")).toHaveTextContent(
        errorMessage
      );
    });
  });

  test("change password works with valid inputs", async () => {
    const user = userEvent.setup();
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordMock.request.variables;

    renderComponent([changePasswordMock]);

    await typeChangePasswordInputs(
      user,
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    expect(mockSetShowChangePasswordModal).toHaveBeenCalledWith(false);
  });
});
