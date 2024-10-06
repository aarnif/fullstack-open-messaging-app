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

export default {
  formatMessageTime,
  sliceLatestMessage,
  newMessagesCount,
};
