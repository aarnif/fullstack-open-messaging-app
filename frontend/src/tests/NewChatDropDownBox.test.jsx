import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import NewChatDropDownBox from "../components/NewChatDropDownBox.jsx";

const mockSetShowNewChatDropdownBox = vi.fn();
const mockSetNewChatModalType = vi.fn();

const renderNewChatDropDownBox = () => {
  return render(
    <NewChatDropDownBox
      setShowNewChatDropdownBox={mockSetShowNewChatDropdownBox}
      setNewChatModalType={mockSetNewChatModalType}
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
    expect(mockSetNewChatModalType).toHaveBeenCalledWith("private");
  });

  test("clicking New Group Chat button calls correct functions", async () => {
    const user = userEvent.setup();
    renderNewChatDropDownBox();

    await user.click(screen.getByTestId("new-group-chat-button"));

    expect(mockSetShowNewChatDropdownBox).toHaveBeenCalledWith(false);
    expect(mockSetNewChatModalType).toHaveBeenCalledWith("group");
  });
});
