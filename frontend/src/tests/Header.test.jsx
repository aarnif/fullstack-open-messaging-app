import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Header from "../components/Header";

test("renders header", async () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  expect(screen.getByTestId("header-title")).toBeInTheDocument();
  expect(screen.getByTestId("header-title")).toHaveTextContent("Messaging App");
});
