import { render, screen } from "@testing-library/react";
import { describe } from "vitest";

import Loading from "../components/ui/Loading.jsx";

describe("<Loading />", () => {
  test("renders component", () => {
    render(<Loading maxHeight={null} loadingText={"Loading..."} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading-text")).toBeInTheDocument();
    expect(screen.getByTestId("loading-text").textContent).toBe("Loading...");
  });
});
