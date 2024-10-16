import { IoChevronBack } from "react-icons/io5";

import ChatMembersList from "./ChatMembersList";

const GroupChatInfoModal = ({ user, chat, setShowChatInfoModal }) => {
  const chatAdmin = chat.admin;
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-white">
      <div className="m-4">
        <button onClick={() => setShowChatInfoModal(false)}>
          <IoChevronBack className="w-7 h-7 text-slate-700 fill-current" />
        </button>
      </div>
      <div className="w-full py-4 flex flex-col justify-center items-center bg-white">
        <button onClick={() => console.log("Show group chat image")}>
          <img
            src={chat.image.thumbnail}
            alt="Chat Thumbnail"
            className="w-32 h-32 rounded-full"
          />
        </button>
        <div className="pt-4 text-xl text-slate-800 font-bold">
          {chat.title}
        </div>
        <div className="mx-8 text-sm text-slate-800 text-center">
          {!chat.description.length ? "No description" : chat.description}
        </div>
      </div>
      <div className="w-full flex-grow flex justify-center bg-white">
        <ChatMembersList user={user} chat={chat} admin={chatAdmin} />
        {user.id !== chatAdmin.id && (
          <div className="w-full p-4 flex flex-col justify-center items-start bg-white">
            <button
              onClick={() => console.log("Leave Chat clicked")}
              className="mb-2 w-full flex-grow max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
            >
              <p className="text-lg font-bold text-slate-700">Leave Chat</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChatInfoModal;
