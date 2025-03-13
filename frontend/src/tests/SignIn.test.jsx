import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import * as apolloClient from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import SignIn from "../components/SignIn";
import { describe, test, vi, expect } from "vitest";

const client = {
  resetStore: vi.fn(),
};

const setActiveMenuItem = vi.fn();

const localStorage = {
  setItem: vi.fn(),
};

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
];

describe("<SignIn />", () => {
  test("clicking sign in works", async () => {
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);

    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <SignIn setActiveMenuItem={setActiveMenuItem} />
        </MemoryRouter>
      </MockedProvider>
    );

    await user.type(
      screen.getByTestId("username-input"),
      mocks[0].request.variables.username
    );
    await user.type(
      screen.getByTestId("password-input"),
      mocks[0].request.variables.password
    );
    await user.click(screen.getByTestId("sign-in-button"));

    expect(screen.getByTestId("sign-in-title")).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-title")).toHaveTextContent("Sign In");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "messaging-app-user-token",
      "fake-token-12345"
    );
    expect(client.resetStore).toHaveBeenCalled();
    expect(setActiveMenuItem).toHaveBeenCalledWith("chats");
  });
});
