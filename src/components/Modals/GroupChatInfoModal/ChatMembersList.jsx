import ChatMember from "./ChatMember";

const ChatMembersList = ({ user, chat, admin }) => {
  return (
    <div className="mt-8 flex-grow w-full max-w-[600px] bg-white">
      <div className="w-full py-2 flex flex-col justify-center items-start bg-white">
        <div className="mx-4 text-xl text-slate-800 font-bold">
          {`${chat.participants.length} members`}
        </div>
      </div>
      {chat.participants.map((item) => (
        <ChatMember key={item.id} user={user} item={item} admin={admin} />
      ))}
    </div>
  );
};

export default ChatMembersList;
