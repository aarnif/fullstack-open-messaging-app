export const getChatTitle = (parent, context) => {
  if (parent.isGroupChat) {
    return parent.title;
  }
  // The title of a private chat is always the name of the other member, not the current user.
  const findOtherPrivateChatMember = parent.members.find(
    (member) => member.id.toString() !== context.currentUser.id.toString()
  );
  return findOtherPrivateChatMember?.name;
};

export const getChatImage = (parent, context) => {
  if (parent.isGroupChat) {
    return parent.image;
  }
  // The image of a private chat is always the image of the other member, not the current user.
  const findOtherPrivateChatMember = parent.members.find(
    (member) => member.id.toString() !== context.currentUser.id.toString()
  );
  return findOtherPrivateChatMember?.image;
};
