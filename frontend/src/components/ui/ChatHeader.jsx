import { useNavigate } from "react-router";

import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

import Button from "./Button";
import Title from "./Title";

const ChatHeader = ({ user, chat, setShowGroupChatInfoModal }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/chats");
  };

  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
      setShowGroupChatInfoModal(true);
    } else {
      console.log("Clicked private chat info!");
      const anotherPrivateChatMember = chat.members.find(
        (member) => member.id !== user.id
      );
      navigate(`/contacts/${anotherPrivateChatMember.id}`);
    }
  };

  const chatMembersString = chatAndMessageHelpers.sliceLatestMessage(
    chatAndMessageHelpers
      .sortChatMembersByNameAndUsername([...chat.members])
      .map((member) =>
        member.username === user.username ? "You" : member.name
      )
      .join(", "),
    30
  );

  return (
    <div
      data-testid="chat-header"
      className="relative w-full flex justify-center items-center p-2 bg-white dark:bg-slate-800 shadow-lg"
    >
      <div className="absolute left-2 flex justify-center items-center sm:hidden">
        <Button
          type="button"
          variant="return"
          testId="go-back-button"
          onClick={goBack}
        />
      </div>

      <button
        data-testid="chat-info-button"
        onClick={getInfo}
        className="flex justify-center items-center"
      >
        <div className="flex justify-center items-center gap-4">
          <img
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
            src={chat.image.thumbnail}
            alt="chat-thumbnail"
          />
          <div className="flex flex-col justify-center items-start">
            <Title variant="tertiary" testId="chat-title" text={chat.title} />

            {chat.isGroupChat && (
              <p className="text-sm text-slate-800 dark:text-slate-100">
                {chatMembersString}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default ChatHeader;
