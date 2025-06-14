import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import Contacts from "../components/Contacts.jsx";

describe("<Contacts />", () => {
  test("renders contacts page", () => {
    render(<Contacts menuComponent={<></>} />);

    expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
    expect(screen.getByTestId("contacts-page")).toHaveTextContent(
      "Select a contact for further information."
    );
  });
});
