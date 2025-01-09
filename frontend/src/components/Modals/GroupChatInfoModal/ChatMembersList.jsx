import ChatMember from "./ChatMember";
import chatAndMessageHelpers from "../../../helpers/chatAndMessageHelpers";

const ChatMembersList = ({ user, chatMembers, admin }) => {
  const displayChatMembers = [
    user,
    chatAndMessageHelpers.sortChatMembersByNameAndUsername([
      ...chatMembers.filter((member) => member.id !== user.id),
    ]),
  ];

  return (
    <div className="mt-8 flex-grow w-full max-w-[600px]">
      <div className="w-full py-2 flex flex-col justify-center items-start">
        <div className="mx-4 text-xl text-slate-800 dark:text-slate-100 font-bold">
          {`${displayChatMembers.length} members`}
        </div>
      </div>
      {displayChatMembers.map((item) => (
        <ChatMember key={item.id} user={user} item={item} admin={admin} />
      ))}
    </div>
  );
};

export default ChatMembersList;
