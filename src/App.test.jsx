import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders content", () => {
  render(<App />);

  const element = screen.getByText(
    "This is a Vite + React + Tailwind CSS app!"
  );

  expect(element).toBeDefined();
});
