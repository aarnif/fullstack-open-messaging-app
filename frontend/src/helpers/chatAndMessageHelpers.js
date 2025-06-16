import { format, isToday, isThisWeek } from "date-fns";

const formatMessageTime = (latestMessageTime, is24HourClock = true) => {
  if (!latestMessageTime) {
    return null;
  } else if (isToday(new Date(latestMessageTime))) {
    return format(
      new Date(latestMessageTime),
      is24HourClock ? "HH:mm" : "HH:mm aaa"
    );
  } else if (isThisWeek(new Date(latestMessageTime))) {
    return format(new Date(latestMessageTime), "EEEE");
  } else {
    return format(new Date(latestMessageTime), "dd.MM.yyyy");
  }
};

const sliceLatestMessage = (latestMessage, characterCount = 20) =>
  latestMessage.length > characterCount
    ? latestMessage.slice(0, characterCount) + "..."
    : latestMessage;

const newUnreadMessagesCount = (user, chatId) => {
  if (!user.unreadMessages) return 0;

  const chatUnread = user.unreadMessages.find(
    (chat) => chat.chatId.id === chatId
  );

  return chatUnread ? chatUnread.messages.length : 0;
};

const newMessagesCount = (user, messages) =>
  messages.filter(
    (message) =>
      message.type === "message" &&
      message.isReadBy.find(
        (member) => member.member.id === user.id && !member.isRead
      )
  ).length;

const sortChatsByDate = (chats) =>
  chats.sort((a, b) => {
    if (!a.messages.length) return 1;

    if (!b.messages.length) return -1;

    return (
      new Date(b.messages[0].createdAt) - new Date(a.messages[0].createdAt)
    );
  });

const sortChatMembersByNameAndUsername = (chatMembers) => {
  return [
    ...chatMembers.sort((a, b) => {
      if (a.name === b.name) {
        return a.username.localeCompare(b.username);
      }
      return a.name.localeCompare(b.name);
    }),
  ];
};

const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
  formatMessageTime,
  sliceLatestMessage,
  newMessagesCount, // Keep old function
  newUnreadMessagesCount, // Add new function
  sortChatsByDate,
  sortChatMembersByNameAndUsername,
  capitalizeString,
};
