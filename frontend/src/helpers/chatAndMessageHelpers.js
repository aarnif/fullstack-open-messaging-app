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

const sortChatsByDate = (chats) =>
  chats.sort(
    (a, b) =>
      new Date(b.chat.messages[b.chat.messages.length - 1].createdAt) -
      new Date(a.chat.messages[a.chat.messages.length - 1].createdAt)
  );

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

  sortChatsByDate,
  sortChatMembersByNameAndUsername,
  capitalizeString,
};
