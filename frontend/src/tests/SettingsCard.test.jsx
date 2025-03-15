import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import SettingsCard from "../components/Settings/SettingsCard.jsx";
import { describe, test, vi, expect, beforeEach } from "vitest";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";
import { EDIT_SETTINGS } from "../graphql/mutations.js";

const { localStorage } = mocks;

Object.defineProperty(global, "localStorage", { value: localStorage });

const userData = mockData[2].result.data.me;

const twelveHourUser = {
  ...userData,
  settings: {
    ...userData.settings,
    time: "12h",
  },
};

const renderComponent = (user, mockData) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <SettingsCard user={user} />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<SettingsCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove("dark");
  });

  test("Settings header renders correctly", () => {
    renderComponent(userData, mockData);

    const header = screen.getByTestId("settings-header");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe("Settings");
  });

  test("User can change to dark mode", async () => {
    const editSettingsMock = {
      request: {
        query: EDIT_SETTINGS,
        variables: { theme: "dark", time: userData.settings.time },
      },
      result: {
        data: {
          editSettings: {
            ...userData,
            settings: {
              ...userData.settings,
              theme: "dark",
            },
          },
        },
      },
    };

    const user = userEvent.setup();

    renderComponent(userData, [...mockData, editSettingsMock]);

    expect(screen.getByTestId("settings-header")).toBeInTheDocument();
    expect(screen.getByTestId("light-mode")).toBeInTheDocument();

    await user.click(screen.getByTestId("dark-mode-button"));
    await screen.findByTestId("dark-mode");

    expect(screen.getByTestId("dark-mode")).toBeInTheDocument();
  });

  test("User can change from dark mode to light mode", async () => {
    const darkModeUser = {
      ...userData,
      settings: {
        ...userData.settings,
        theme: "dark",
      },
    };

    const editSettingsMock = {
      request: {
        query: EDIT_SETTINGS,
        variables: { theme: "light", time: userData.settings.time },
      },
      result: {
        data: {
          editSettings: {
            ...userData,
            settings: {
              ...userData.settings,
              theme: "light",
            },
          },
        },
      },
    };

    const user = userEvent.setup();
    renderComponent(darkModeUser, [...mockData, editSettingsMock]);

    expect(screen.getByTestId("dark-mode")).toBeInTheDocument();

    await user.click(screen.getByTestId("dark-mode-button"));

    expect(screen.getByTestId("light-mode")).toBeInTheDocument();
  });

  test("Shows correct clock format setting", () => {
    renderComponent(twelveHourUser, mockData);
    expect(screen.getByTestId("12-hour-clock")).toBeInTheDocument();
  });

  test("User can toggle clock format", async () => {
    const user = userEvent.setup();

    const editSettingsMock = {
      request: {
        query: EDIT_SETTINGS,
        variables: { theme: userData.settings.theme, time: "24h" },
      },
      result: {
        data: {
          editSettings: {
            ...userData,
            settings: {
              ...userData.settings,
              time: "24h",
            },
          },
        },
      },
    };

    renderComponent(twelveHourUser, [...mockData, editSettingsMock]);

    expect(screen.getByTestId("12-hour-clock")).toBeInTheDocument();
    const clockToggleButton = screen.getByTestId("time-format-button");
    expect(clockToggleButton).toBeInTheDocument();

    await user.click(clockToggleButton);
    await screen.findByTestId("24-hour-clock");
    expect(screen.getByTestId("24-hour-clock")).toBeInTheDocument();
  });
});
