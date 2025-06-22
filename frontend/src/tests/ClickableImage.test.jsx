import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ClickableImage from "../components/ui/ClickableImage.jsx";

describe("<ClickableImage />", () => {
  const testImageUrl = "https://example.com/test-image.jpg";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders image with fullscreen toggle button", () => {
    render(<ClickableImage fullScreenImageUri={testImageUrl} />);

    expect(
      screen.getByTestId("show-fullscreen-view-button")
    ).toBeInTheDocument();
  });

  test("does not display fullscreen view initially", () => {
    render(<ClickableImage fullScreenImageUri={testImageUrl} />);

    expect(screen.queryByTestId("full-screen-view")).not.toBeInTheDocument();
  });

  test("displays fullscreen view on toggle button click", async () => {
    const user = userEvent.setup();

    render(<ClickableImage fullScreenImageUri={testImageUrl} />);
    await user.click(screen.getByTestId("show-fullscreen-view-button"));
    expect(screen.queryByTestId("full-screen-view")).toBeInTheDocument();
  });

  test("hides fullscreen view on screen click", async () => {
    const user = userEvent.setup();

    render(<ClickableImage fullScreenImageUri={testImageUrl} />);
    await user.click(screen.getByTestId("show-fullscreen-view-button"));
    expect(screen.queryByTestId("full-screen-view")).toBeInTheDocument();

    await user.click(screen.getByTestId("full-screen-view"));
    expect(screen.queryByTestId("full-screen-view")).not.toBeInTheDocument();
  });
});
