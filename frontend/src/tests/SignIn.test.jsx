import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import SignIn from "../components/SignIn";
import { describe, test, vi, expect } from "vitest";
import mockData from "./mocks/data.js";
import mocks from "./mocks/funcs.js";

const { loginMock } = mockData;
const { client, setActiveMenuItem, localStorage, navigate } = mocks;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

Object.defineProperty(global, "localStorage", { value: localStorage });

const renderSignIn = () => {
  return render(
    <MockedProvider mocks={[loginMock]}>
      <MemoryRouter>
        <SignIn setActiveMenuItem={setActiveMenuItem} />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<SignIn />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("clicking sign in works", async () => {
    const user = userEvent.setup();
    const { username, password } = loginMock.request.variables;

    renderSignIn();
    await user.type(screen.getByTestId("username-input"), username);
    await user.type(screen.getByTestId("password-input"), password);
    await user.click(screen.getByTestId("sign-in-button"));

    expect(screen.getByTestId("sign-in-title")).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-title")).toHaveTextContent("Sign In");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "messaging-app-user-token",
      "fake-token-12345"
    );
    expect(client.resetStore).toHaveBeenCalled();
    expect(setActiveMenuItem).toHaveBeenCalledWith("chats");
    expect(navigate).toHaveBeenCalledWith("/chats");
  });

  test("clicking sign up button navigates to signup page", async () => {
    const user = userEvent.setup();

    renderSignIn();

    await user.click(screen.getByTestId("sign-up-button"));
    expect(navigate).toHaveBeenCalledWith("/signup");
  });
});
