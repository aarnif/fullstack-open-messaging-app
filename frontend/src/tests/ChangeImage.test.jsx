import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ChangeImage from "../components/ChangeImage.jsx";

describe("<ChangeImage />", () => {
  const mockSetBase64Image = vi.fn();
  const testImageUrl = "https://example.com/test-image.jpg";
  const testImageType = "profile";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders component with correct image", () => {
    render(
      <ChangeImage
        currentImage={testImageUrl}
        imageType={testImageType}
        setBase64Image={mockSetBase64Image}
      />
    );

    expect(screen.getByTestId("change-image")).toBeInTheDocument();

    const imageElement = screen.getByTestId("current-image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toBe(testImageUrl);
  });

  test("handles image change correctly", async () => {
    const user = userEvent.setup();
    const file = new File(["new image file content"], "example.png", {
      type: "image/png",
    });

    render(
      <ChangeImage
        currentImage={testImageUrl}
        imageType={testImageType}
        setBase64Image={mockSetBase64Image}
      />
    );

    await user.click(screen.getByTestId("change-image-button"));
    await user.upload(screen.getByTestId("change-image-input"), file);

    expect(mockSetBase64Image).toHaveBeenCalled();

    const imageElement = screen.getByTestId("current-image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain("data:image/png;base64");
  });
});
