import messages from "./messages.js";
import users from "./users.js";

const chats = [
  // Group chats
  {
    _id: "6690cc6331f8d4e66b57ae22",
    title: "Weekend Hikers",
    description:
      "A group of enthusiasts who love to explore trails and mountains every weekend.",
    members: [users[0], users[1], users[7]],
    messages: messages[0],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57ae4c",
    title: "Book Club",
    description:
      "A club for avid readers to discuss and share their thoughts on various books.",
    members: [users[0], users[2], users[3]],
    messages: messages[1],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57aeb2",
    title: "Gaming Night",
    description:
      "A group dedicated to organizing and enjoying weekly gaming sessions.",
    members: [users[0], users[4], users[5], users[1]],
    messages: messages[2],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57af18",
    title: "Yoga Enthusiasts",
    description:
      "A community of yoga lovers who share tips, routines, and support each other.",
    members: [users[0], users[3], users[2], users[8]],
    messages: messages[3],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57afce",
    title: "Music Band",
    description:
      "A band of musicians collaborating on new music and sharing their passion.",
    members: [users[0], users[4], users[9]],
    messages: messages[4],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b066",
    title: "Cooking Lovers",
    description:
      "A group for those who enjoy cooking and sharing recipes and culinary tips.",
    members: [users[0], users[10], users[2], users[6]],
    messages: messages[5],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b0e0",
    title: "Photography Crew",
    description:
      "A collective of photographers who share their work and discuss techniques.",
    members: [users[0], users[7], users[9], users[1], users[3]],
    messages: messages[6],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b19c",
    title: "Movie Buffs",
    description:
      "A group for movie enthusiasts to discuss films, actors, and upcoming releases.",
    members: [users[0], users[5], users[8], users[4]],
    messages: messages[7],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b234",
    title: "Tech Geeks",
    description:
      "A community for tech enthusiasts to discuss the latest in technology and gadgets.",
    members: [users[0], users[3], users[10]],
    messages: messages[8],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b29a",
    title: "Fitness Freaks",
    description:
      "A group of fitness enthusiasts sharing workouts, nutrition tips, and motivation.",
    members: [users[0], users[6], users[2], users[9]],
    messages: messages[9],
    isGroupChat: true,
    admin: users[0],
  },
  {
    _id: "6690cc6331f8d4e66b57b300",
    title: "Travel Buddies",
    description:
      "A group for travelers to share experiences, tips, and plan new adventures.",
    members: [users[0], users[7], users[10], users[1], users[8]],
    messages: messages[10],
    isGroupChat: true,
    admin: users[0],
  },
];

// Add each chat to the user's chat list
chats.forEach((chat) => {
  chat.members.forEach((member) => {
    member.chats.push(chat);
  });
});

export default chats;
