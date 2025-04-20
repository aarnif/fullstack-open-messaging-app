import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import * as apolloClient from "@apollo/client";
import Home from "../components/Home.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import subscriptionMocks from "./mocks/subscriptionsMocks.js";
import mocks from "./mocks/funcs.js";

const {
  currentUserMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
} = queryMocks;

const { addContactsMock } = mutationMocks;

const { contactBlockedOrUnBlockedMock, groupChatEditedMock } =
  subscriptionMocks;
const { client, navigate } = mocks;

const userData = currentUserMock.result.data.me;

const mockActiveMenuItem = vi.fn();
const mockSetActiveMenuItem = vi.fn();
const mockSetActiveListMenuComponent = vi.fn();
const mockSetActiveChatOrContactId = vi.fn();

const mockModal = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: mockModal,
  }),
}));

const renderComponent = () => {
  render(
    <MockedProvider
      mocks={[
        currentUserMock,
        allContactsExceptByUserMock,
        allContactsExceptByUserSearchMock,
        addContactsMock,
        contactBlockedOrUnBlockedMock,
        groupChatEditedMock,
      ]}
    >
      <MemoryRouter>
        <Home
          user={userData}
          activeMenuItem={mockActiveMenuItem}
          setActiveMenuItem={mockSetActiveMenuItem}
          setActiveListMenuComponent={mockSetActiveListMenuComponent}
          setActiveChatOrContactId={mockSetActiveChatOrContactId}
        />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<Home />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    vi.spyOn(apolloClient, "useApolloClient").mockReturnValue(client);
  });

  test("renders component", () => {
    renderComponent();

    expect(screen.getByTestId("home")).toBeInTheDocument();
    expect(screen.getByTestId("menu")).toBeInTheDocument();
  });
});
