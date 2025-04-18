import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import useModal from "../hooks/useModal";

import ModalProvider from "../components/ModalProvider.jsx";

const onConfirmMock = vi.fn();

const TestConsumer = ({ modalInfo }) => {
  const { modal } = useModal();

  const handleModalOpen = () => {
    modal(...Object.values(modalInfo));
  };

  return (
    <button data-testid="open-modal-button" onClick={handleModalOpen}>
      Open Modal
    </button>
  );
};

const renderComponent = (modalInfo) => {
  return render(
    <ModalProvider>
      <TestConsumer modalInfo={modalInfo} />
      <div data-testid="children-component"></div>
    </ModalProvider>
  );
};

describe("<ModalProvider />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders children component", () => {
    renderComponent();
    expect(screen.getByTestId("children-component")).toBeInTheDocument();
  });

  test("modal is not visible by default", () => {
    renderComponent();
    expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
  });

  test("alert modal can be opened and closed", async () => {
    const modalInfo = {
      type: "alert",
      title: "Alert Title",
      message: "Alert Message",
    };
    const user = userEvent.setup();

    renderComponent(modalInfo);

    await user.click(screen.getByTestId("open-modal-button"));

    expect(screen.getByTestId("modal-provider")).toBeInTheDocument();
    expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
    expect(screen.getByText(modalInfo.title)).toBeInTheDocument();
    expect(screen.getByText(modalInfo.message)).toBeInTheDocument();

    await user.click(screen.getByTestId("close-modal-button"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
        expect(screen.queryByTestId("alert-modal")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  test("success modal can be opened and closed", async () => {
    const modalInfo = {
      type: "success",
      title: "Success Title",
      message: "Success Message",
      confirmText: "Confirm",
      onConfirm: onConfirmMock,
    };
    const user = userEvent.setup();

    renderComponent(modalInfo);

    await user.click(screen.getByTestId("open-modal-button"));

    expect(screen.getByText(modalInfo.title)).toBeInTheDocument();
    expect(screen.getByText(modalInfo.message)).toBeInTheDocument();
    expect(screen.getByText(modalInfo.confirmText)).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-button"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  test("success modal confirm button calls onConfirm", async () => {
    const modalInfo = {
      type: "success",
      title: "Success Title",
      message: "Success Message",
      confirmText: "Confirm",
      onConfirm: onConfirmMock,
    };
    const user = userEvent.setup();

    renderComponent(modalInfo);

    await user.click(screen.getByTestId("open-modal-button"));

    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test("danger modal can be opened and closed", async () => {
    const modalInfo = {
      type: "danger",
      title: "Danger Title",
      message: "Danger Message",
      confirmText: "Delete",
      onConfirm: onConfirmMock,
    };
    const user = userEvent.setup();

    renderComponent(modalInfo);

    await user.click(screen.getByTestId("open-modal-button"));

    expect(screen.getByText(modalInfo.title)).toBeInTheDocument();
    expect(screen.getByText(modalInfo.message)).toBeInTheDocument();
    expect(screen.getByText(modalInfo.confirmText)).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-button"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  test("danger modal confirm button calls onConfirm", async () => {
    const modalInfo = {
      type: "danger",
      title: "Danger Title",
      message: "Danger Message",
      confirmText: "Delete",
      onConfirm: onConfirmMock,
    };
    const user = userEvent.setup();

    renderComponent(modalInfo);

    await user.click(screen.getByTestId("open-modal-button"));
    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("modal-provider")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
