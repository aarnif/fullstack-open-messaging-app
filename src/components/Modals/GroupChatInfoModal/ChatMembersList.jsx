import ChatMember from "./ChatMember";

const ChatMembersList = ({ user, chatParticipants, admin }) => {
  return (
    <div className="mt-8 flex-grow w-full max-w-[600px]">
      <div className="w-full py-2 flex flex-col justify-center items-start">
        <div className="mx-4 text-xl text-slate-800 dark:text-slate-100 font-bold">
          {`${chatParticipants.length} members`}
        </div>
      </div>
      {chatParticipants.map((item) => (
        <ChatMember key={item.id} user={user} item={item} admin={admin} />
      ))}
    </div>
  );
};

export default ChatMembersList;
