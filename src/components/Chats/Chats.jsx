import useField from "../../../hooks/useField";
import ChatsMenu from "../ChatsMenu";

const Chats = ({ user }) => {
  const searchWord = useField("text", "Enter your username here...");

  return (
    <div className="flex-grow flex">
      <ChatsMenu user={user} searchWord={searchWord} />
      <div className="flex-grow flex justify-center items-center">
        <div>Select Chat to Start Messaging.</div>
      </div>
    </div>
  );
};

export default Chats;
