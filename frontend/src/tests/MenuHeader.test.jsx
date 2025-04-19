import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import queryMocks from "./mocks/queryMocks.js";

import MenuHeader from "../components/MenuHeader";

const { mockSearchWord } = queryMocks;

const mockHandleCallBack = vi.fn();

const renderMenuHeader = (title = "Chats") => {
  return render(
    <MenuHeader
      title={title}
      handleCallBack={mockHandleCallBack}
      searchWord={mockSearchWord}
    />
  );
};

describe("<MenuHeader />", () => {
  test("renders menu header", () => {
    renderMenuHeader();

    expect(screen.getByTestId("menu-header")).toBeInTheDocument();
  });

  test("renders menu header with correct title", () => {
    renderMenuHeader("Contacts");

    expect(screen.getByTestId("menu-header")).toHaveTextContent("Contacts");
  });

  test("click new chat button works if title 'Chats'", async () => {
    const user = userEvent.setup();
    renderMenuHeader();

    await user.click(screen.getByTestId("new-chat-button"));

    expect(mockHandleCallBack).toHaveBeenCalled();
  });

  test("click new chat button works if title 'Contacts'", async () => {
    const user = userEvent.setup();
    renderMenuHeader("Contacts");

    await user.click(screen.getByTestId("new-contact-button"));

    expect(mockHandleCallBack).toHaveBeenCalled();
  });
});
