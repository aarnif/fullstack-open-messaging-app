import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import SearchBar from "../components/SearchBar";

const mockSearchWord = {
  value: "Travel",
};

describe("<SearchBar />", () => {
  test("renders component with correct search text", () => {
    render(
      <SearchBar searchWord={mockSearchWord} dataTestId={"search-input"} />
    );

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toHaveValue("Travel");
  });
});
