import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import IndividualContactCard from "../components/IndividualContactCard/IndividualContactCard.jsx";
import mockData from "./mocks/data.js";

const userData = mockData[2].result.data.me;
const contactData = mockData[3].result.data.findUserById;

describe("<IndividualContactCard />", () => {
  test("renders component with correct contact", () => {
    render(<IndividualContactCard user={userData} contact={contactData} />);

    expect(screen.getByTestId("individual-contact-card")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText(contactData.name)).toBeInTheDocument();
    expect(screen.getByText(`@${contactData.username}`)).toBeInTheDocument();
    expect(screen.getByText(contactData.about)).toBeInTheDocument();
  });

  test("displays username as 'You' when contact is the user", () => {
    render(<IndividualContactCard user={userData} contact={userData} />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText(userData.name)).toBeInTheDocument();
    expect(screen.getByText(`@${userData.username}`)).toBeInTheDocument();
    expect(screen.getByText(userData.about)).toBeInTheDocument();
  });
});
