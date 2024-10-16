import ContactCard from "../../Contacts/ContactCard";

const ChatMember = ({ user, item, admin }) => {
  return (
    <div className="flex tems-center py-2 px-4 rounded-lg">
      <ContactCard user={user} item={item} admin={admin} />
    </div>
  );
};

export default ChatMember;
