import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloError } from "@apollo/client";
import { MemoryRouter, useNavigate } from "react-router";

import ModalProvider from "../components/ModalProvider.jsx";
import { NewMessageInput } from "../components/Chat.jsx";
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

  const renderNewChatComponent = (
    mockData = [findNewChatByMembersMock, createNewChatMock]
  ) => {
    return renderComponent(mockData, null, mockNewChatInfo);
  };

  const renderExistingChatComponent = (
    mockData = [currentUserMock, findGroupChatByIdMock, addMessageToChatMock]
  ) => {
    return renderComponent(mockData, chatId);
  };

  const typeMessageAndSend = async (user, message = TEST_MESSAGE) => {
    await user.type(screen.getByTestId("new-message-input"), message);
    await user.click(screen.getByTestId("send-new-message-button"));
  };

  const uploadImageAndSend = async (user, message = TEST_MESSAGE) => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.type(screen.getByTestId("new-message-input"), message);
    await user.click(screen.getByTestId("send-new-message-button"));
  };

  const sendEmptyMessage = async (user) => {
    await user.click(screen.getByTestId("send-new-message-button"));
  };

  const uploadImageOnly = async (user) => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.click(screen.getByTestId("send-new-message-button"));
  };

  test("renders component", async () => {
    renderComponent();
    expect(screen.getByTestId("new-message-input")).toBeInTheDocument();
  });

  test("creates chat with text message", async () => {
    const user = userEvent.setup();
    renderNewChatComponent();

    await typeMessageAndSend(user);

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
    );
  });

  test("creates chat with image and text", async () => {
    const user = userEvent.setup();
    renderNewChatComponent();

    await uploadImageAndSend(user);

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
    );
  });

  test("creates chat with image only", async () => {
    const user = userEvent.setup();
    renderNewChatComponent([
      findNewChatByMembersMock,
      createNewChatWithImageOnlyMock,
    ]);

    await uploadImageOnly(user);

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatWithImageOnlyMock.result.data.createChat.id}`
    );
  });

  test("handles error during chat creation", async () => {
    const user = userEvent.setup();
    const errorMock = {
      request: createNewChatMock.request,
      error: new ApolloError({
        graphQLErrors: [{ message: "Failed to create chat" }],
      }),
    };

    renderNewChatComponent([findNewChatByMembersMock, errorMock]);
    await typeMessageAndSend(user);

    expect(navigate).not.toHaveBeenCalled();
  });

  test("sends text message to existing chat", async () => {
    const user = userEvent.setup();
    renderExistingChatComponent();

    await typeMessageAndSend(user);

    expect(screen.getByTestId("new-message-input")).toHaveValue("");
  });

  test("sends message with image to existing chat", async () => {
    const user = userEvent.setup();
    const mockWithImage = {
      request: {
        ...addMessageToChatMock.request,
        variables: {
          ...addMessageToChatMock.request.variables,
          input: { thumbnail: "thumb_url", original: "original_url" },
        },
      },
      result: addMessageToChatMock.result,
    };

    renderExistingChatComponent([
      currentUserMock,
      findGroupChatByIdMock,
      mockWithImage,
    ]);
    await uploadImageAndSend(user);

    expect(screen.getByTestId("new-message-input")).toHaveValue("");
  });

  test("displays error when message sending fails", async () => {
    const user = userEvent.setup();
    const errorMock = {
      request: addMessageToChatMock.request,
      error: new ApolloError({
        graphQLErrors: [{ message: "Failed to add message to chat" }],
      }),
    };

    renderExistingChatComponent([
      currentUserMock,
      findGroupChatByIdMock,
      errorMock,
    ]);
    await typeMessageAndSend(user);

    expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to add message to chat")
    ).toBeInTheDocument();
  });

  test("prevents sending empty message", async () => {
    const user = userEvent.setup();
    renderComponent();

    await sendEmptyMessage(user);

    expect(navigate).not.toHaveBeenCalled();
  });
});
