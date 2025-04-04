import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ContactCard from "../components/Contacts/ContactCard";
import mockData from "./mocks/data.js";

const { currentUserMock, findUserByIdMock } = mockData;

const userData = currentUserMock.result.data.me;
const contactData = findUserByIdMock.result.data.findUserById;

describe("<ContactCard />", () => {
  test("renders contact with correct info", () => {
    render(<ContactCard user={userData} item={contactData} />);

    expect(screen.getByTestId("contact-card")).toBeInTheDocument();
    expect(screen.getByText(contactData.name)).toBeInTheDocument();
    expect(screen.getByText(`@${contactData.username}`)).toBeInTheDocument();
    expect(screen.getByText(contactData.about)).toBeInTheDocument();
  });

  test("displays contact name as 'You' when contact is the user", () => {
    render(<ContactCard user={userData} item={userData} />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText(`@${userData.username}`)).toBeInTheDocument();
    expect(screen.getByText(userData.about)).toBeInTheDocument();
  });

  test("displays 'Admin' label when contact is an admin", () => {
    render(
      <ContactCard user={userData} item={contactData} admin={contactData} />
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
