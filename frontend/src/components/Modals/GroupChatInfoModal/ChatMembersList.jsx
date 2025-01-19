import ChatMember from "./ChatMember";
import chatAndMessageHelpers from "../../../helpers/chatAndMessageHelpers";

const ChatMembersList = ({ user, chatMembers, admin }) => {
  const displayChatMembers = [
    user,
    ...chatAndMessageHelpers.sortChatMembersByNameAndUsername(
      chatMembers.filter((member) => member.id !== user.id)
    ),
  ];

  return (
    <div className="mt-2 sm:mt-8 flex-grow w-full max-w-[600px] flex flex-col">
      <div className="w-full py-2 flex flex-col justify-center items-start">
        <div className="mx-4 text-base sm:text-xl text-slate-800 dark:text-slate-100 font-bold">
          {`${displayChatMembers.length} members`}
        </div>
      </div>
      <div className="flex-grow sm:overflow-y-auto sm:h-0">
        {displayChatMembers.map((item) => (
          <ChatMember key={item.id} user={user} item={item} admin={admin} />
        ))}
      </div>
    </div>
  );
};

export default ChatMembersList;
