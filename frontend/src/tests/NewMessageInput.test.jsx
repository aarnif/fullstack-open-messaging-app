import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloError } from "@apollo/client";
import { MemoryRouter, useNavigate } from "react-router";

import ModalProvider from "../components/ModalProvider.jsx";
import NewMessageInput from "../components/ui/NewMessageInput.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findGroupChatByIdMock, findNewChatByMembersMock } =
  queryMocks;
const {
  createNewChatMock,
  createNewChatWithImageOnlyMock,
  addMessageToChatMock,
  mockNewChatInfo,
} = mutationMocks;
const { navigate } = mocks;

const userData = currentUserMock.result.data.me;
const chatId = findGroupChatByIdMock.result.data.findChatById.id;

const TEST_MESSAGE = "Hello, this is a test message!";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../services/imageService", () => ({
  default: {
    uploadImage: vi.fn(() =>
      Promise.resolve({
        data: {
          thumb: { url: "thumb_url" },
          image: { url: "original_url" },
        },
      })
    ),
  },
}));

const renderComponent = (mockData, chatId = null, newChatInfo = null) => {
  render(
    <MockedProvider mocks={mockData} addTypename={false}>
      <MemoryRouter>
        <ModalProvider>
          <NewMessageInput
            user={userData}
            chatId={chatId}
            newChatInfo={newChatInfo}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewMessageInput />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.setItem("new-chat-info", JSON.stringify(mockNewChatInfo));
  });

  test("handles send message", async () => {
    const user = userEvent.setup();
    renderComponent(
      [currentUserMock, findGroupChatByIdMock, addMessageToChatMock],
      chatId
    );

    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(screen.getByTestId("new-message-input")).toHaveValue("");
  });

  test("handles send message with image", async () => {
    const user = userEvent.setup();
    const addMessageWithImageMock = {
      request: {
        query: addMessageToChatMock.request.query,
        variables: {
          ...addMessageToChatMock.request.variables,
          input: { thumbnail: "thumb_url", original: "original_url" },
        },
      },
      result: {
        data: {
          addMessageToChat: {
            ...addMessageToChatMock.result.data.addMessageToChat,
            image: {
              thumbnail: { url: "thumb_url" },
              original: { url: "original_url" },
            },
          },
        },
      },
    };
    renderComponent(
      [currentUserMock, findGroupChatByIdMock, addMessageWithImageMock],
      chatId
    );

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(screen.getByTestId("new-message-input")).toHaveValue("");
  });

  test("display error message if sending message fails", async () => {
    const user = userEvent.setup();
    const error = new ApolloError({
      graphQLErrors: [{ message: "Failed to add message to chat" }],
    });
    const errorMock = {
      request: {
        query: addMessageToChatMock.request.query,
        variables: addMessageToChatMock.request.variables,
      },
      error,
    };

    renderComponent(
      [currentUserMock, findGroupChatByIdMock, errorMock],
      chatId
    );

    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to add message to chat")
    ).toBeInTheDocument();
  });

  test("handles create chat with first text message", async () => {
    const user = userEvent.setup();

    renderComponent(
      [findNewChatByMembersMock, createNewChatMock],
      null,
      mockNewChatInfo
    );
    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
    );
  });

  test("handles create chat with first image message", async () => {
    const user = userEvent.setup();

    renderComponent(
      [findNewChatByMembersMock, createNewChatMock],
      null,
      mockNewChatInfo
    );

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
    );
  });

  test("prevents sending empty message", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).not.toHaveBeenCalled();
  });

  test("handles image-only message", async () => {
    const user = userEvent.setup();

    renderComponent(
      [findNewChatByMembersMock, createNewChatWithImageOnlyMock],
      null,
      mockNewChatInfo
    );

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatWithImageOnlyMock.result.data.createChat.id}`
    );
  });

  test("handles error during chat creation", async () => {
    const user = userEvent.setup();
    const error = new ApolloError({
      graphQLErrors: [{ message: "Failed to create chat" }],
    });
    const createNewChatErrorMock = {
      request: {
        query: createNewChatMock.request.query,
        variables: createNewChatMock.request.variables,
      },
      error,
    };

    renderComponent(
      [findNewChatByMembersMock, createNewChatErrorMock],
      null,
      mockNewChatInfo
    );

    await user.type(screen.getByTestId("new-message-input"), TEST_MESSAGE);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).not.toHaveBeenCalled();
  });
});
