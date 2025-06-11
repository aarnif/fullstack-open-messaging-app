import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import queryMocks from "./mocks/queryMocks.js";

import SelectContactsList from "../components/ui/SelectContactsList";

const { allContactsByUserMock } = queryMocks;
const contactData =
  allContactsByUserMock.result.data.allContactsByUser.contacts;

const mockSetChosenUserIds = vi.fn();

const renderComponent = (mockContactData = contactData) => {
  render(
    <SelectContactsList
      data={mockContactData}
      chosenUserIds={[]}
      setChosenUserIds={mockSetChosenUserIds}
    />
  );
};

describe("<SelectContactsList />", () => {
  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("select-contacts-list")).toBeInTheDocument();
  });

  test("renders no contacts if no data", () => {
    const emptyContactData = [];
    renderComponent(emptyContactData);

    expect(screen.getByText("No contacts found")).toBeInTheDocument();
  });
});
