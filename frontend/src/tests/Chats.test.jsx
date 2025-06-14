import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import Chats from "../components/Chats.jsx";

describe("<Chats />", () => {
  test("renders chats page", () => {
    render(<Chats menuComponent={<></>} />);

    expect(screen.getByTestId("chats-page")).toBeInTheDocument();
    expect(screen.getByTestId("chats-page")).toHaveTextContent(
      "Select Chat to Start Messaging."
    );
  });
});
