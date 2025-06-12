import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import ModalProvider from "../components/ModalProvider.jsx";
import Settings from "../components/Settings.jsx";
import { describe, test, vi, expect, beforeEach } from "vitest";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock } = queryMocks;
const { editSettingsMock } = mutationMocks;

const { localStorage } = mocks;

Object.defineProperty(global, "localStorage", { value: localStorage });

const userData = currentUserMock.result.data.me;

const createUserWithSettings = (settingsOverrides) => ({
  ...userData,
  settings: {
    ...userData.settings,
    ...settingsOverrides,
  },
});

const createSettingsMock = (settingsOverrides) => ({
  request: {
    ...editSettingsMock.request,
    variables: {
      ...editSettingsMock.request.variables,
      ...settingsOverrides,
    },
  },
  result: {
    data: {
      editSettings: {
        ...editSettingsMock.result.data.editSettings,
        settings: {
          ...editSettingsMock.result.data.editSettings.settings,
          ...settingsOverrides,
        },
      },
    },
  },
});

const twelveHourUser = createUserWithSettings({ time: "12h" });

const renderComponent = (user, mockData) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <Settings user={user} />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<Settings />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove("dark");
  });

  test("Settings page renders correctly", () => {
    renderComponent(userData, [currentUserMock, editSettingsMock]);

    expect(screen.getByTestId("settings-page")).toBeInTheDocument();
    const header = screen.getByTestId("settings-header");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe("Settings");
  });

  test("User can change to dark mode", async () => {
    const editSettingsMockWithDarkMode = createSettingsMock({ theme: "dark" });

    const user = userEvent.setup();

    renderComponent(userData, [currentUserMock, editSettingsMockWithDarkMode]);

    expect(screen.getByTestId("settings-header")).toBeInTheDocument();
    expect(screen.getByTestId("light-mode")).toBeInTheDocument();

    await user.click(screen.getByTestId("dark-mode-button"));
    await screen.findByTestId("dark-mode");

    expect(screen.getByTestId("dark-mode")).toBeInTheDocument();
  });

  test("User can change from dark mode to light mode", async () => {
    const darkModeUser = createUserWithSettings({ theme: "dark" });

    const editSettingsMockWithLightMode = createSettingsMock({
      theme: "light",
    });

    const user = userEvent.setup();
    renderComponent(darkModeUser, [
      currentUserMock,
      editSettingsMockWithLightMode,
    ]);

    expect(screen.getByTestId("dark-mode")).toBeInTheDocument();

    await user.click(screen.getByTestId("dark-mode-button"));

    expect(screen.getByTestId("light-mode")).toBeInTheDocument();
  });

  test("Shows correct clock format setting", () => {
    renderComponent(twelveHourUser, [currentUserMock]);
    expect(screen.getByTestId("12-hour-clock")).toBeInTheDocument();
  });

  test("User can toggle clock format", async () => {
    const user = userEvent.setup();

    const editSettingsMockWith24Hour = createSettingsMock({ time: "24h" });

    renderComponent(twelveHourUser, [
      currentUserMock,
      editSettingsMockWith24Hour,
    ]);

    expect(screen.getByTestId("12-hour-clock")).toBeInTheDocument();
    const clockToggleButton = screen.getByTestId("time-format-button");
    expect(clockToggleButton).toBeInTheDocument();

    await user.click(clockToggleButton);
    await screen.findByTestId("24-hour-clock");
    expect(screen.getByTestId("24-hour-clock")).toBeInTheDocument();
  });

  test("User can open change password modal", async () => {
    const user = userEvent.setup();
    renderComponent(userData, [currentUserMock]);

    expect(screen.getByTestId("settings-header")).toBeInTheDocument();
    expect(screen.getByTestId("change-password-button")).toBeInTheDocument();

    await user.click(screen.getByTestId("change-password-button"));

    expect(screen.getByTestId("change-password-modal")).toBeInTheDocument();
  });
});
