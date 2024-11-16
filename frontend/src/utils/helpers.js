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
    return format(new Date(latestMessageTime), "MM.dd.yyyy");
  }
};

const sliceLatestMessage = (latestMessage, characterCount = 20) =>
  latestMessage.length > characterCount
    ? latestMessage.slice(0, characterCount) + "..."
    : latestMessage;

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

const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
  formatMessageTime,
  sliceLatestMessage,
  newMessagesCount,
  sortChatsByDate,
  capitalizeString,
};
