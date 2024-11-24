import ChatMember from "./ChatMember";

const ChatMembersList = ({ user, chatMembers, admin }) => {
  return (
    <div className="mt-8 flex-grow w-full max-w-[600px]">
      <div className="w-full py-2 flex flex-col justify-center items-start">
        <div className="mx-4 text-xl text-slate-800 dark:text-slate-100 font-bold">
          {`${chatMembers.length} members`}
        </div>
      </div>
      {chatMembers.map((item) => (
        <ChatMember key={item.id} user={user} item={item} admin={admin} />
      ))}
    </div>
  );
};

export default ChatMembersList;
