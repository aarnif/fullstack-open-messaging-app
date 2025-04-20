import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";

import NewChatHeader from "../components/NewChat/NewChatHeader.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock } = queryMocks;
const { createNewChatMock, addMessageToNewChatMock, mockNewChatInfo } =
  mutationMocks;

const { navigate } = mocks;

const userData = currentUserMock.result.data.me;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (newChatInfo = mockNewChatInfo) => {
  render(
    <MockedProvider mocks={[createNewChatMock, addMessageToNewChatMock]}>
      <MemoryRouter>
        <NewChatHeader user={userData} chat={newChatInfo} />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewChatHeader />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders header", async () => {
    renderComponent();

    expect(screen.getByTestId("new-chat-header"));
    expect(screen.getByTestId("new-chat-title")).toBeInTheDocument();
    expect(screen.getByTestId("new-chat-title")).toHaveTextContent(
      mockNewChatInfo.title
    );
  });

  test("click private chat info button works", async () => {
    const user = userEvent.setup();
    const newPrivateChatInfo = {
      ...mockNewChatInfo,
      members: mockNewChatInfo.members.slice(0, 2),
      isGroupChat: false,
    };
    renderComponent(newPrivateChatInfo);

    await user.click(screen.getByTestId("chat-info-button"));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      `/contacts/${newPrivateChatInfo.members[1].id}`
    );
  });

  test("click group chat info button works", async () => {
    const user = userEvent.setup();
    const newGroupChatInfo = {
      ...mockNewChatInfo,
      members: mockNewChatInfo.members.slice(0, 3),
      isGroupChat: true,
    };
    renderComponent(newGroupChatInfo);

    await user.click(screen.getByTestId("chat-info-button"));
    expect(navigate).not.toHaveBeenCalled();
  });
});
