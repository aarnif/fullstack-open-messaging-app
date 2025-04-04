import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Settings from "../components/Settings/Settings.jsx";
import { describe, test, expect } from "vitest";
import mockData from "./mocks/data.js";

const { editSettingsMock, currentUserMock } = mockData;

const userData = currentUserMock.result.data.me;

describe("<Settings />", () => {
  test("Settings page renders correctly", () => {
    render(
      <MockedProvider mocks={[editSettingsMock]}>
        <Settings user={userData} menuComponent={<></>} />
      </MockedProvider>
    );

    expect(screen.getByTestId("settings-page")).toBeInTheDocument();
  });
});
