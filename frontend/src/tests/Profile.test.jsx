import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import queryMocks from "./mocks/queryMocks";
import mutationMocks from "./mocks/mutationMocks.js";
import Profile from "../components/Profile";

const { currentUserMock } = queryMocks;
const { editProfileMock } = mutationMocks;

const userData = currentUserMock.result.data.me;

const renderProfile = () => {
  return render(
    <MockedProvider mocks={[editProfileMock]}>
      <Profile user={userData} />
    </MockedProvider>
  );
};

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: vi.fn(),
  }),
}));

describe("<Profile />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders profile page", () => {
    renderProfile();

    expect(screen.getByTestId("profile")).toBeInTheDocument();
  });

  test("does not display edit profile modal initially", () => {
    renderProfile();
    expect(screen.queryByTestId("edit-profile-modal")).not.toBeInTheDocument();
  });

  test("displays edit profile modal on button click", async () => {
    const user = userEvent.setup();
    renderProfile();
    await user.click(screen.getByTestId("edit-profile-button"));
    expect(screen.queryByTestId("edit-profile-modal")).toBeInTheDocument();
  });
});
