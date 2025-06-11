import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloError } from "@apollo/client";
import { MemoryRouter, useNavigate } from "react-router";

import { NewChatAndFirstMessage } from "../components/NewChat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";
import mocks from "./mocks/funcs.js";

const { currentUserMock, findNewChatByMembersMock } = queryMocks;

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

const renderComponent = (
  mockData = [
    findNewChatByMembersMock,
    createNewChatMock,
    addMessageToNewChatMock,
  ]
) => {
  render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <NewChatAndFirstMessage user={userData} newChatInfo={mockNewChatInfo} />
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<NewChatAndFirstMessage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component", async () => {
    renderComponent();

    expect(screen.getByTestId("new-message-box"));
  });

  test("handles create chat with first text message", async () => {
    const user = userEvent.setup();

    renderComponent();
    await user.type(
      screen.getByTestId("new-message-input"),
      addMessageToNewChatMock.result.data.addMessageToChat.messages[0].content
    );
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(screen.getByTestId("new-message-input")).toHaveValue(
      addMessageToNewChatMock.result.data.addMessageToChat.messages[0].content
    );
    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
    );
  });

  test("handles create chat with first image message", async () => {
    const user = userEvent.setup();
    const addMessageWithImageMock = {
      request: {
        query: addMessageToNewChatMock.request.query,
        variables: {
          ...addMessageToNewChatMock.request.variables,
          input: { thumbnail: "thumb_url", original: "original_url" },
        },
      },
      result: {
        data: {
          addMessageToChat: {
            ...addMessageToNewChatMock.result.data.addMessageToChat,
            image: {
              thumbnail: { url: "thumb_url" },
              original: { url: "original_url" },
            },
          },
        },
      },
    };
    renderComponent([
      findNewChatByMembersMock,
      createNewChatMock,
      addMessageWithImageMock,
    ]);

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.type(
      screen.getByTestId("new-message-input"),
      addMessageToNewChatMock.result.data.addMessageToChat.messages[0].content
    );
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(screen.getByTestId("new-message-input")).toHaveValue(
      addMessageToNewChatMock.result.data.addMessageToChat.messages[0].content
    );
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
    const addImageOnlyMessageMock = {
      request: {
        query: addMessageToNewChatMock.request.query,
        variables: {
          ...addMessageToNewChatMock.request.variables,
          content: "",
          input: { thumbnail: "thumb_url", original: "original_url" },
        },
      },
      result: {
        data: {
          addMessageToChat: {
            ...addMessageToNewChatMock.result.data.addMessageToChat,
            messages: [
              {
                ...addMessageToNewChatMock.result.data.addMessageToChat
                  .messages[0],
                content: "",
              },
            ],
            image: {
              thumbnail: { url: "thumb_url" },
              original: { url: "original_url" },
            },
          },
        },
      },
    };

    renderComponent([
      findNewChatByMembersMock,
      createNewChatMock,
      addImageOnlyMessageMock,
    ]);

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).toHaveBeenCalledWith(
      `/chats/${createNewChatMock.result.data.createChat.id}`
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

    renderComponent([
      findNewChatByMembersMock,
      createNewChatErrorMock,
      addMessageToNewChatMock,
    ]);

    await user.type(screen.getByTestId("new-message-input"), "Test message");
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(navigate).not.toHaveBeenCalled();
  });
});
