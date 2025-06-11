import Title from "./Title";
import ContactCard from "../Contacts/ContactCard";
import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

const ChatMembersList = ({ user, chatMembers, admin }) => {
  const displayChatMembers = [
    user,
    ...chatAndMessageHelpers.sortChatMembersByNameAndUsername(
      chatMembers.filter((member) => member.id !== user.id)
    ),
  ];

  return (
    <div className="flex-grow w-full flex flex-col gap-4">
      <Title
        variant="secondary"
        testId="group-chat-members-title"
        text={`${displayChatMembers.length} members`}
      />

      <div className="flex-grow sm:overflow-y-auto sm:h-0 flex flex-col gap-4">
        {displayChatMembers.map((item) => (
          <ContactCard key={item.id} user={user} item={item} admin={admin} />
        ))}
      </div>
    </div>
  );
};

export default ChatMembersList;
