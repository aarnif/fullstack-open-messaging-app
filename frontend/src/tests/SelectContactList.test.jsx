import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import queryMocks from "./mocks/queryMocks.js";

import { SelectContactList } from "../components/Modals/NewPrivateChatModal";

const { allContactsByUserMock } = queryMocks;
const contactData =
  allContactsByUserMock.result.data.allContactsByUser.contacts;

const mockSetChosenUserId = vi.fn();

const renderComponent = (mockContactData = contactData) => {
  render(
    <SelectContactList
      data={mockContactData}
      chosenUserId={[]}
      setChosenUserId={mockSetChosenUserId}
    />
  );
};

describe("<SelectContactList />", () => {
  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("select-contact-list")).toBeInTheDocument();
  });

  test("renders no contacts if no data", () => {
    const emptyContactData = [];
    renderComponent(emptyContactData);

    expect(screen.getByText("No contacts found")).toBeInTheDocument();
  });
});
