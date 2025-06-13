import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloError } from "@apollo/client";

import { NewMessage } from "../components/Chat.jsx";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";

const { currentUserMock, findGroupChatByIdMock } = queryMocks;
const { addMessageToChatMock } = mutationMocks;

const userData = currentUserMock.result.data.me;

const mockModal = vi.fn();

vi.mock("../hooks/useModal", () => ({
  default: () => ({
    modal: mockModal,
  }),
}));

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

const renderComponent = (mockData) => {
  render(
    <MockedProvider mocks={mockData} addTypename={false}>
      <NewMessage
        user={userData}
        chatId={findGroupChatByIdMock.result.data.findChatById.id}
      />
    </MockedProvider>
  );
};

describe("<NewMessage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("handles send message", async () => {
    const user = userEvent.setup();
    renderComponent([
      currentUserMock,
      findGroupChatByIdMock,
      addMessageToChatMock,
    ]);

    await user.type(screen.getByTestId("new-message-input"), "This is a test.");
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
    renderComponent([
      currentUserMock,
      findGroupChatByIdMock,
      addMessageWithImageMock,
    ]);

    const file = new File(["test"], "test.png", { type: "image/png" });
    await user.upload(screen.getByTestId("image-input"), file);
    await user.type(screen.getByTestId("new-message-input"), "This is a test.");
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

    renderComponent([currentUserMock, findGroupChatByIdMock, errorMock]);

    await user.type(screen.getByTestId("new-message-input"), "This is a test.");
    await user.click(screen.getByTestId("send-new-message-button"));

    expect(mockModal).toHaveBeenCalled();
  });
});
