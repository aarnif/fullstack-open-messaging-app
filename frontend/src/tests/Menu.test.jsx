import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router";
import * as apolloClient from "@apollo/client";
import mocks from "./mocks/funcs.js";
import Menu from "../components/Menu.jsx";

const mockSetActiveMenuItem = vi.fn();
const mockSetActiveListMenuComponent = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();
const mockModal = vi.fn();
const { client, navigate } = mocks;

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

const renderMenu = (activeMenuItem = "chats") => {
  return render(
    <MemoryRouter>
      <Menu
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={mockSetActiveMenuItem}
        setActiveListMenuComponent={mockSetActiveListMenuComponent}
        setActiveChatOrContactId={mockSetActiveChatOrContactId}
      />
    </MemoryRouter>
  );
};

describe("<Menu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("renders menu", () => {
    renderMenu();

    expect(screen.getByTestId("menu")).toBeInTheDocument();
  });

  test("navigates to contacts page on contacts button click", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByTestId("contacts-button"));

    expect(mockSetActiveMenuItem).toHaveBeenCalledWith("contacts");
    expect(mockSetActiveListMenuComponent).toHaveBeenCalledWith("contacts");
    expect(navigate).toHaveBeenCalledWith("/contacts");
  });

  test("navigates to profile page on profile button click", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByTestId("profile-button"));

    expect(mockSetActiveMenuItem).toHaveBeenCalledWith("profile");
    expect(navigate).toHaveBeenCalledWith("/profile");
  });

  test("navigates to settings page on settings button click", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByTestId("settings-button"));

    expect(mockSetActiveMenuItem).toHaveBeenCalledWith("settings");
    expect(navigate).toHaveBeenCalledWith("/settings");
  });

  test("navigates back to chats on chats button click from another page", async () => {
    const user = userEvent.setup();
    renderMenu("contacts");

    await user.click(screen.getByTestId("chats-button"));

    expect(mockSetActiveMenuItem).toHaveBeenCalledWith("chats");
    expect(mockSetActiveListMenuComponent).toHaveBeenCalledWith("chats");
    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("displays confirmation modal on logout button click", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByTestId("logout-button"));
    expect(mockModal).toHaveBeenCalled();
  });
});
