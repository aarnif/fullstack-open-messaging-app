import { render, screen } from "@testing-library/react";
import { describe } from "vitest";
import { useLocation } from "react-router";

import mocks from "./mocks/funcs.js";
import Header from "../components/Header";

const { location } = mocks;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe("<Header />", () => {
  test("renders header", () => {
    useLocation.mockReturnValue(location);
    render(<Header />);

    expect(screen.getByTestId("header-title")).toBeInTheDocument();
  });
});
