import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import mockData from "./mocks/data.js";
import NewMessageBox from "../components/NewMessageBox";
import { MockedIntersectionObserver } from "jsdom-testing-mocks";

const { currentUserMock } = mockData;

const userData = currentUserMock.result.data.me;

const mockMessage = "";
const mockSetMessage = vi.fn();
const mockImage = "https://example.com/image.jpg";
const mockSetImage = vi.fn();
const mockSetBase64Image = vi.fn();
const mockHandleSubmit = vi.fn();

const renderComponent = () =>
  render(
    <NewMessageBox
      user={userData}
      message={mockMessage}
      setMessage={mockSetMessage}
      image={mockImage}
      setImage={mockSetImage}
      setBase64Image={mockSetBase64Image}
      handleSubmit={mockHandleSubmit}
    />
  );

describe("<NewMessageBox />", () => {
  beforeAll(() => {
    global.IntersectionObserver = MockedIntersectionObserver;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("new-message-box")).toBeInTheDocument();
  });

  test("handles image upload", async () => {
    const user = userEvent.setup();
    const file = new File(["test"], "test.png", { type: "image/png" });
    renderComponent();

    await user.click(screen.getByTestId("add-image-button"));
    await user.upload(screen.getByTestId("image-input"), file);

    expect(mockSetBase64Image).toHaveBeenCalled();
  });

  test("handles image cancel", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("cancel-image-button"));

    expect(mockSetImage).toHaveBeenCalledWith(null);
    expect(mockSetBase64Image).toHaveBeenCalledWith(null);
  });

  test("handles message input change", async () => {
    const user = userEvent.setup();
    renderComponent();

    const newMessageInput = screen.getByTestId("new-message-input");
    const newMessageContent = "Hello";

    await user.type(newMessageInput, newMessageContent);

    expect(mockSetMessage).toHaveBeenCalled();
  });

  test("handles emoji picker toggle", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("show-emoji-picker-button"));

    expect(screen.getByTestId("emoji-picker")).toBeVisible();
  });
});
