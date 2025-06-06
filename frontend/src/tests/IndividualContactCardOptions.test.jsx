import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import ModalProvider from "../components/ModalProvider.jsx";
import IndividualContactCardOptions from "../components/IndividualContactCard/IndividualContactCardOptions.jsx";
import mocks from "./mocks/funcs.js";
import queryMocks from "./mocks/queryMocks.js";
import mutationMocks from "./mocks/mutationMocks.js";

const {
  currentUserMock,
  findUserByIdMock,
  findChatByMembersMock,
  allContactsByUserMock,
} = queryMocks;
const { blockOrUnblockContactMock, removeContactMock } = mutationMocks;

const userData = currentUserMock.result.data.me;
const contactData = findUserByIdMock.result.data.findUserById;

const existingChatId = findChatByMembersMock.result.data.findChatByMembers.id;

const mockSetIsBlocked = vi.fn();
const { navigate } = mocks;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderIndividualContactCardOptions = (
  mockIsBlocked = false,
  mockHaveContactBlockedYou = false,
  mockData = [
    findChatByMembersMock,
    allContactsByUserMock,
    blockOrUnblockContactMock,
    removeContactMock,
  ]
) => {
  return render(
    <MockedProvider mocks={mockData}>
      <MemoryRouter>
        <ModalProvider>
          <IndividualContactCardOptions
            user={userData}
            contact={contactData}
            isBlocked={mockIsBlocked}
            setIsBlocked={mockSetIsBlocked}
            haveContactBlockedYou={mockHaveContactBlockedYou}
          />
        </ModalProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("<IndividualContactCardOptions />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders component with option buttons", () => {
    renderIndividualContactCardOptions();

    const chatButton = screen.queryByTestId("chat-with-contact-button");

    expect(
      screen.getByTestId("individual-contact-card-options")
    ).toBeInTheDocument();
    expect(chatButton).toBeInTheDocument();
    expect(chatButton).not.toHaveAttribute("disabled");
    expect(
      screen.getByTestId("block-or-unblock-contact-button")
    ).toBeInTheDocument();
    expect(screen.getByTestId("remove-contact-button")).toBeInTheDocument();
  });

  test("do not display chat button if contact has blocked you", () => {
    const mockIsBlocked = false;
    const mockHaveContactBlockedYou = true;
    renderIndividualContactCardOptions(
      mockIsBlocked,
      mockHaveContactBlockedYou
    );

    const chatButton = screen.queryByTestId("chat-with-contact-button");

    expect(chatButton).toBeInTheDocument();
    expect(chatButton).toHaveAttribute("disabled");
  });

  test("click chat button directs to existing private chat", async () => {
    const user = userEvent.setup();
    renderIndividualContactCardOptions();

    await user.click(screen.getByTestId("chat-with-contact-button"));

    expect(navigate).toHaveBeenCalledWith(`/chats/${existingChatId}`);
  });

  test("click chat button directs to new private chat", async () => {
    const existingChatNotFound = {
      ...findChatByMembersMock,
      result: {
        ...findChatByMembersMock.result,
        data: {
          ...findChatByMembersMock.result.data,
          findChatByMembers: null,
        },
      },
    };
    const mockIsBlocked = false;
    const mockHaveContactBlockedYou = false;
    const user = userEvent.setup();
    renderIndividualContactCardOptions(
      mockIsBlocked,
      mockHaveContactBlockedYou,
      [
        existingChatNotFound,
        allContactsByUserMock,
        blockOrUnblockContactMock,
        removeContactMock,
      ]
    );

    await user.click(screen.getByTestId("chat-with-contact-button"));

    expect(navigate).toHaveBeenCalledWith("/chats/new");
  });

  test("click block/unblock button", async () => {
    const user = userEvent.setup();
    renderIndividualContactCardOptions();

    await user.click(screen.getByTestId("block-or-unblock-contact-button"));
    await user.click(screen.getByTestId("confirm-button"));

    expect(mockSetIsBlocked).toHaveBeenCalledWith(true);
  });

  test("click remove contact button", async () => {
    const user = userEvent.setup();
    renderIndividualContactCardOptions();

    await user.click(screen.getByTestId("remove-contact-button"));
    await user.click(screen.getByTestId("confirm-button"));

    expect(navigate).toHaveBeenCalledWith("/contacts");
  });
});
