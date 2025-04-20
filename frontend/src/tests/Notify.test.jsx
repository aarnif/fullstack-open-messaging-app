import { render, screen } from "@testing-library/react";
import Notify from "../components/Notify.jsx";
import { describe, vi } from "vitest";

describe("<Notify />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders notify message", () => {
    const notifyMessage = {
      content: "This is a test notification",
    };

    render(<Notify notifyMessage={notifyMessage} />);

    expect(screen.getByTestId("notify-message")).toBeInTheDocument();
  });

  test("does not render when notifyMessage is null", () => {
    render(<Notify notifyMessage={null} />);

    expect(screen.queryByTestId("notify-message")).not.toBeInTheDocument();
  });

  test("does not render when notifyMessage.content is null", () => {
    const notifyMessage = {
      content: null,
    };

    render(<Notify notifyMessage={notifyMessage} />);

    expect(screen.queryByTestId("notify-message")).not.toBeInTheDocument();
  });
});
