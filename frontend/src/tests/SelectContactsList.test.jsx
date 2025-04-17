import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import mockData from "./mocks/data.js";

import SelectContactsList from "../components/Modals/SelectContactsList";

const { allContactsByUserMock } = mockData;
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
