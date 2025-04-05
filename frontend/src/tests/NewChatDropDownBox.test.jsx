import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import NewChatDropDownBox from "../components/Modals/NewChatDropDownBox.jsx";

const mockSetShowNewChatDropdownBox = vi.fn();
const mockSetShowNewPrivateChatModal = vi.fn();
const mockSetShowNewGroupChatModal = vi.fn();

const renderNewChatDropDownBox = () => {
  return render(
    <NewChatDropDownBox
      setShowNewChatDropdownBox={mockSetShowNewChatDropdownBox}
      setShowNewPrivateChatModal={mockSetShowNewPrivateChatModal}
      setShowNewGroupChatModal={mockSetShowNewGroupChatModal}
    />
  );
};

describe("<NewChatDropDownBox />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dropdown box with correct menu items", () => {
    renderNewChatDropDownBox();

    expect(screen.getByTestId("new-chat-dropdown-box")).toBeInTheDocument();
    expect(screen.getByText("New Private Chat")).toBeInTheDocument();
    expect(screen.getByText("New Group Chat")).toBeInTheDocument();
  });

  test("clicking New Private Chat button calls correct functions", async () => {
    const user = userEvent.setup();
    renderNewChatDropDownBox();

    await user.click(screen.getByTestId("new-private-chat-button"));

    expect(mockSetShowNewChatDropdownBox).toHaveBeenCalledWith(false);
    expect(mockSetShowNewPrivateChatModal).toHaveBeenCalledWith(true);
  });

  test("clicking New Group Chat button calls correct functions", async () => {
    const user = userEvent.setup();
    renderNewChatDropDownBox();

    await user.click(screen.getByTestId("new-group-chat-button"));

    expect(mockSetShowNewChatDropdownBox).toHaveBeenCalledWith(false);
    expect(mockSetShowNewGroupChatModal).toHaveBeenCalledWith(true);
  });
});
