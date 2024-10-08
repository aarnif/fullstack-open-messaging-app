import ChatsMenu from "../ChatsMenu";

const Chats = ({ user }) => {
  return (
    <div className="flex-grow flex">
      <ChatsMenu user={user} />
      <div className="flex-grow flex justify-center items-center">
        <div>Select Chat to Start Messaging.</div>
      </div>
    </div>
  );
};

export default Chats;
