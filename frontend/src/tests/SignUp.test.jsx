import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import { LOGIN, CREATE_USER } from "../graphql/mutations";
import SignUp from "../components/SignUp";
import { describe, test, vi, expect } from "vitest";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const client = {
  resetStore: vi.fn(),
};

const setActiveMenuItem = vi.fn();

const localStorage = {
  setItem: vi.fn(),
};

const navigate = vi.fn();

Object.defineProperty(global, "localStorage", { value: localStorage });

const mocks = [
  {
    request: {
      query: LOGIN,
      variables: { username: "test", password: "password" },
    },
    result: {
      data: {
        login: {
          value: "fake-token-12345",
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER,
      variables: {
        username: "test",
        password: "password",
        confirmPassword: "password",
      },
    },
    result: {
      data: {
        createUser: {
          username: "test",
          name: "Test",
        },
      },
    },
  },
];

describe("<SignUp />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("clicking sign up works", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <SignUp setActiveMenuItem={setActiveMenuItem} />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.type(
      screen.getByTestId("username-input"),
      mocks[1].request.variables.username
    );
    await user.type(
      screen.getByTestId("password-input"),
      mocks[1].request.variables.password
    );
    await user.type(
      screen.getByTestId("confirm-password-input"),
      mocks[1].request.variables.confirmPassword
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

  test("clicking return to sign in button navigates to signin page", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <SignUp setActiveMenuItem={setActiveMenuItem} />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.click(screen.getByTestId("return-to-sign-in-button"));
    expect(navigate).toHaveBeenCalledWith("/signin");
  });
});
