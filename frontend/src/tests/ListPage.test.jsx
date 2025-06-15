import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import ListPage from "../components/ListPage.jsx";

describe("<ListPage />", () => {
  test("renders chats page", () => {
    render(<ListPage type="chats" menuComponent={<></>} />);

    expect(screen.getByTestId("chats-page")).toBeInTheDocument();
    expect(screen.getByTestId("chats-page")).toHaveTextContent(
      "Select Chat to Start Messaging."
    );
  });

  test("renders contacts page", () => {
    render(<ListPage type="contacts" menuComponent={<></>} />);

    expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
    expect(screen.getByTestId("contacts-page")).toHaveTextContent(
      "Select a contact for further information."
    );
  });
});
