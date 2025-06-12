import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Settings from "../components/Settings.jsx";
import { describe, test, expect } from "vitest";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";

const { currentUserMock } = queryMocks;
const { editSettingsMock } = mutationMocks;

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
