import { render, screen } from "@testing-library/react";
import LoadingPage from "../components/LoadingPage";

test("renders header", async () => {
  render(<LoadingPage />);

  expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  expect(screen.getByTestId("loading-page-title")).toHaveTextContent(
    "Messaging App"
  );
});
