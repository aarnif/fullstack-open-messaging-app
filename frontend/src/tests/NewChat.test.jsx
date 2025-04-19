import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";

import NewChat from "../components/NewChat/NewChat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock } = queryMocks;

const { createNewChatMock, addMessageToNewChatMock, mockNewChatInfo } =
  mutationMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockSetActiveMenuItem = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

Object.defineProperty(global, "localStorage", { value: localStorage });

const renderComponent = () => {
  render(
    <MockedProvider mocks={[createNewChatMock, addMessageToNewChatMock]}>
      <MemoryRouter>
        <NewChat
          user={userData}
          setActiveMenuItem={mockSetActiveMenuItem}
          menuComponent={<></>}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewChat />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.setItem("new-chat-info", JSON.stringify(mockNewChatInfo));
  });

  test("renders page", async () => {
    renderComponent();

    expect(screen.getByTestId("new-chat-page"));
  });
});
