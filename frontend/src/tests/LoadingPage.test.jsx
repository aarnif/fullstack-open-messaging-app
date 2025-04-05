import { render, screen } from "@testing-library/react";
import { describe } from "vitest";

import LoadingPage from "../components/LoadingPage.jsx";

describe("<LoadingPage />", () => {
  test("renders component", () => {
    render(<LoadingPage />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });
});
