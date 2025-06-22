import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import SignUp from "../components/SignUp";
import { describe, test, vi, expect } from "vitest";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { loginMock, createUserMock } = mutationMocks;

const { client, setActiveMenuItem, localStorage, navigate } = mocks;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

Object.defineProperty(global, "localStorage", { value: localStorage });

const renderSignUp = () => {
  return render(
    <MockedProvider mocks={[loginMock, createUserMock]}>
      <MemoryRouter>
        <SignUp setActiveMenuItem={setActiveMenuItem} />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<SignUp />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("signs up user successfully", async () => {
    const user = userEvent.setup();
    const { username, password, confirmPassword } =
      createUserMock.request.variables;

    renderSignUp();

    await user.type(screen.getByTestId("username-input"), username);
    await user.type(screen.getByTestId("password-input"), password);
    await user.type(
      screen.getByTestId("confirm-password-input"),
      confirmPassword
    );
    await user.click(screen.getByTestId("sign-up-submit-button"));

    expect(screen.getByTestId("sign-up-title")).toBeInTheDocument();
    expect(screen.getByTestId("sign-up-title")).toHaveTextContent("Sign Up");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "messaging-app-user-token",
      "fake-token-12345"
    );
    expect(client.resetStore).toHaveBeenCalled();
    expect(setActiveMenuItem).toHaveBeenCalledWith("chats");
    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("navigates to signin page on return button click", async () => {
    const user = userEvent.setup();

    renderSignUp();

    await user.click(screen.getByTestId("return-to-sign-in-button"));
    expect(navigate).toHaveBeenCalledWith("/signin");
  });
});
