import { render, screen } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { useLocation } from "react-router";

import mocks from "./mocks/funcs.js";
import { Header } from "../App.jsx";

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

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("header-title")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toHaveClass("bg-white");
  });

  test.each(["/signin", "/signup"])(
    "renders header without background on %s route",
    (pathname) => {
      useLocation.mockReturnValue({ pathname });
      render(<Header />);

      expect(screen.getByTestId("header")).not.toHaveClass("bg-white");
      expect(screen.getByTestId("header")).not.toHaveClass("shadow-lg");
      expect(screen.getByTestId("header")).not.toHaveClass("dark:bg-slate-900");
    }
  );
});
