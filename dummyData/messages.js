import users from "./users.js";
import chats from "./chats.js";

const messages = [
  [
    {
      sender: users[0],
      chat: chats[0],
      content: "Hey everyone, are we still on for hiking this weekend?",
      createdAt: new Date("2024-06-01T10:00:00Z"),
    },
    {
      sender: users[2],
      chat: chats[0],
      content: "Yes! I'm really looking forward to it. What's the plan?",
      createdAt: new Date("2024-06-01T10:05:00Z"),
    },
    {
      sender: users[4],
      chat: chats[0],
      content: "Count me in! Should we meet at the usual spot?",
      createdAt: new Date("2024-06-01T10:10:00Z"),
    },
    {
      sender: users[0],
      chat: chats[0],
      content:
        "Yes, let's meet at the trailhead at 8 AM. Does that work for everyone?",
      createdAt: new Date("2024-06-01T10:15:00Z"),
    },
    {
      sender: users[2],
      chat: chats[0],
      content: "8 AM works for me. What about snacks and water?",
      createdAt: new Date("2024-06-01T10:20:00Z"),
    },
    {
      sender: users[4],
      chat: chats[0],
      content: "I'll bring some granola bars and extra water bottles.",
      createdAt: new Date("2024-06-01T10:25:00Z"),
    },
    {
      sender: users[0],
      chat: chats[0],
      content:
        "Great, I'll bring some fruits and a first-aid kit just in case.",
      createdAt: new Date("2024-06-01T10:30:00Z"),
    },
    {
      sender: users[2],
      chat: chats[0],
      content:
        "Sounds good! Let's make sure to take some breaks and enjoy the view.",
      createdAt: new Date("2024-06-01T10:35:00Z"),
    },
    {
      sender: users[4],
      chat: chats[0],
      content: "Absolutely! Looking forward to it. See you all tomorrow!",
      createdAt: new Date("2024-06-01T10:40:00Z"),
    },
    {
      sender: users[0],
      chat: chats[0],
      content: "See you all tomorrow! Get a good night's rest.",
      createdAt: new Date("2024-06-01T10:45:00Z"),
    },
  ],

  [
    {
      sender: users[1],
      chat: chats[1],
      content: "Hey everyone, what book should we read next?",
      createdAt: new Date("2024-06-01T09:00:00Z"),
    },
    {
      sender: users[3],
      chat: chats[1],
      content:
        "How about 'To Kill a Mockingbird'? I've heard great things about it.",
      createdAt: new Date("2024-06-01T09:05:00Z"),
    },
    {
      sender: users[5],
      chat: chats[1],
      content: "That's a great choice! I've been meaning to read it.",
      createdAt: new Date("2024-06-01T09:10:00Z"),
    },
    {
      sender: users[7],
      chat: chats[1],
      content: "I'm in! When should we meet to discuss it?",
      createdAt: new Date("2024-06-01T09:15:00Z"),
    },
    {
      sender: users[1],
      chat: chats[1],
      content: "How about next Saturday at 3 PM?",
      createdAt: new Date("2024-06-01T09:20:00Z"),
    },
    {
      sender: users[3],
      chat: chats[1],
      content: "That works for me. Should we meet at the usual place?",
      createdAt: new Date("2024-06-01T09:25:00Z"),
    },
    {
      sender: users[5],
      chat: chats[1],
      content: "Yes, the coffee shop sounds perfect.",
      createdAt: new Date("2024-06-01T09:30:00Z"),
    },
    {
      sender: users[7],
      chat: chats[1],
      content: "I'll bring some snacks!",
      createdAt: new Date("2024-06-01T09:35:00Z"),
    },
    {
      sender: users[1],
      chat: chats[1],
      content: "Awesome! I'll see you all next Saturday then.",
      createdAt: new Date("2024-06-01T09:40:00Z"),
    },
    {
      sender: users[3],
      chat: chats[1],
      content: "Can't wait! Happy reading, everyone.",
      createdAt: new Date("2024-06-01T09:45:00Z"),
    },
    {
      sender: users[5],
      chat: chats[1],
      content: "Hey guys, how far have you gotten with the book?",
      createdAt: new Date("2024-06-02T09:00:00Z"),
    },
    {
      sender: users[7],
      chat: chats[1],
      content: "I'm halfway through. It's really good!",
      createdAt: new Date("2024-06-02T09:05:00Z"),
    },
    {
      sender: users[1],
      chat: chats[1],
      content: "I just started, but I'm loving it so far.",
      createdAt: new Date("2024-06-02T09:10:00Z"),
    },
    {
      sender: users[3],
      chat: chats[1],
      content: "I'm almost done. Can't wait to discuss it.",
      createdAt: new Date("2024-06-02T09:15:00Z"),
    },
    {
      sender: users[5],
      chat: chats[1],
      content: "Great! Let's keep going and we'll have a lot to talk about.",
      createdAt: new Date("2024-06-02T09:20:00Z"),
    },
    {
      sender: users[7],
      chat: chats[1],
      content: "Agreed! See you all on Saturday.",
      createdAt: new Date("2024-06-02T09:25:00Z"),
    },
    {
      sender: users[1],
      chat: chats[1],
      content: "Just finished the book! It's amazing.",
      createdAt: new Date("2024-06-02T09:30:00Z"),
    },
    {
      sender: users[3],
      chat: chats[1],
      content: "Same here! It's such a powerful story.",
      createdAt: new Date("2024-06-02T09:35:00Z"),
    },
    {
      sender: users[5],
      chat: chats[1],
      content: "I'm so excited for our discussion.",
      createdAt: new Date("2024-06-02T09:40:00Z"),
    },
    {
      sender: users[7],
      chat: chats[1],
      content: "Me too! See you all on Saturday!",
      createdAt: new Date("2024-06-02T09:45:00Z"),
    },
  ],

  [
    {
      sender: users[2],
      chat: chats[2],
      content: "Hey everyone, ready for Gaming Night?",
      createdAt: new Date("2024-06-01T19:00:00Z"),
    },
    {
      sender: users[4],
      chat: chats[2],
      content: "Absolutely! What game are we playing tonight?",
      createdAt: new Date("2024-06-01T19:05:00Z"),
    },
    {
      sender: users[6],
      chat: chats[2],
      content: "I'm up for some Rocket League. How about you guys?",
      createdAt: new Date("2024-06-01T19:10:00Z"),
    },
    {
      sender: users[8],
      chat: chats[2],
      content: "Rocket League sounds fun! I'm in.",
      createdAt: new Date("2024-06-01T19:15:00Z"),
    },
    {
      sender: users[2],
      chat: chats[2],
      content: "Great! Let's meet online at 8 PM then.",
      createdAt: new Date("2024-06-01T19:20:00Z"),
    },
    {
      sender: users[4],
      chat: chats[2],
      content: "8 PM works for me. I'll bring snacks!",
      createdAt: new Date("2024-06-01T19:25:00Z"),
    },
    {
      sender: users[6],
      chat: chats[2],
      content:
        "Snacks sound great! I'll make sure my internet is working well.",
      createdAt: new Date("2024-06-01T19:30:00Z"),
    },
    {
      sender: users[8],
      chat: chats[2],
      content: "Looking forward to it. See you all at 8!",
      createdAt: new Date("2024-06-01T19:35:00Z"),
    },
    {
      sender: users[2],
      chat: chats[2],
      content: "Hey everyone, I'm online now. Ready when you are!",
      createdAt: new Date("2024-06-01T20:00:00Z"),
    },
    {
      sender: users[4],
      chat: chats[2],
      content: "Joining now! Let's get this started.",
      createdAt: new Date("2024-06-01T20:05:00Z"),
    },
    {
      sender: users[6],
      chat: chats[2],
      content: "I'm in too. Let's go team!",
      createdAt: new Date("2024-06-01T20:10:00Z"),
    },
    {
      sender: users[8],
      chat: chats[2],
      content: "Ready to play! Let's do this.",
      createdAt: new Date("2024-06-01T20:15:00Z"),
    },
    {
      sender: users[2],
      chat: chats[2],
      content: "Great game, guys! That was intense.",
      createdAt: new Date("2024-06-01T21:00:00Z"),
    },
    {
      sender: users[4],
      chat: chats[2],
      content: "Yeah, we really nailed that last round!",
      createdAt: new Date("2024-06-01T21:05:00Z"),
    },
    {
      sender: users[6],
      chat: chats[2],
      content: "Can't believe we pulled off that comeback.",
      createdAt: new Date("2024-06-01T21:10:00Z"),
    },
    {
      sender: users[8],
      chat: chats[2],
      content: "Teamwork makes the dream work!",
      createdAt: new Date("2024-06-01T21:15:00Z"),
    },
    {
      sender: users[2],
      chat: chats[2],
      content: "We should do this more often.",
      createdAt: new Date("2024-06-01T21:20:00Z"),
    },
    {
      sender: users[4],
      chat: chats[2],
      content: "Definitely. How about same time next week?",
      createdAt: new Date("2024-06-01T21:25:00Z"),
    },
    {
      sender: users[6],
      chat: chats[2],
      content: "Count me in. This was a blast!",
      createdAt: new Date("2024-06-01T21:30:00Z"),
    },
    {
      sender: users[8],
      chat: chats[2],
      content: "I'm up for it. See you guys next week!",
      createdAt: new Date("2024-06-01T21:35:00Z"),
    },
  ],

  [
    {
      sender: users[0],
      chat: chats[3],
      content: "Good morning, everyone! Ready for our yoga session today?",
      createdAt: new Date("2024-06-01T07:00:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content:
        "Good morning! I'm excited for today's session. What's the focus?",
      createdAt: new Date("2024-06-01T07:05:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Morning! How about we focus on flexibility today?",
      createdAt: new Date("2024-06-01T07:10:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content:
        "Sounds great to me. I've been wanting to improve my flexibility.",
      createdAt: new Date("2024-06-01T07:15:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "Awesome! Let's start with some gentle stretches to warm up.",
      createdAt: new Date("2024-06-01T07:20:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Great idea. I'll follow your lead.",
      createdAt: new Date("2024-06-01T07:25:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Same here. Let's get started!",
      createdAt: new Date("2024-06-01T07:30:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "Feeling good already. Thanks for the guidance.",
      createdAt: new Date("2024-06-01T07:35:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content:
        "Let's move on to some deeper stretches. How's everyone feeling?",
      createdAt: new Date("2024-06-01T07:40:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Feeling great! Loving the session so far.",
      createdAt: new Date("2024-06-01T07:45:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Feeling the stretch! It's challenging but rewarding.",
      createdAt: new Date("2024-06-01T07:50:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "This is fantastic. Thanks for organizing this.",
      createdAt: new Date("2024-06-01T07:55:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "You're welcome! Let's try some balance poses next.",
      createdAt: new Date("2024-06-01T08:00:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Balance poses are my favorite. Let's do it.",
      createdAt: new Date("2024-06-01T08:05:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "I could use some help with balance. Any tips?",
      createdAt: new Date("2024-06-01T08:10:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "Focus on a fixed point and breathe steadily. It helps!",
      createdAt: new Date("2024-06-01T08:15:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "Exactly. Let's start with the tree pose.",
      createdAt: new Date("2024-06-01T08:20:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Tree pose is a great choice. Feeling grounded.",
      createdAt: new Date("2024-06-01T08:25:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Thanks for the tip. Feeling more stable already.",
      createdAt: new Date("2024-06-01T08:30:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "This is really helpful. Thanks, everyone!",
      createdAt: new Date("2024-06-01T08:35:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "Let's finish with some deep breathing and relaxation.",
      createdAt: new Date("2024-06-01T08:40:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Perfect way to end the session. Thanks for leading.",
      createdAt: new Date("2024-06-01T08:45:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Feeling relaxed and refreshed. Great session!",
      createdAt: new Date("2024-06-01T08:50:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "Thanks, everyone! Looking forward to the next one.",
      createdAt: new Date("2024-06-01T08:55:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "Great job today! See you all next week.",
      createdAt: new Date("2024-06-01T09:00:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Bye everyone! Have a great week.",
      createdAt: new Date("2024-06-01T09:05:00Z"),
    },
    {
      sender: users[7],
      chat: chats[3],
      content: "Take care, everyone!",
      createdAt: new Date("2024-06-01T09:10:00Z"),
    },
    {
      sender: users[9],
      chat: chats[3],
      content: "See you next time!",
      createdAt: new Date("2024-06-01T09:15:00Z"),
    },
    {
      sender: users[0],
      chat: chats[3],
      content: "Remember to practice your balance poses during the week.",
      createdAt: new Date("2024-06-01T09:20:00Z"),
    },
    {
      sender: users[5],
      chat: chats[3],
      content: "Will do! Thanks for the reminder.",
      createdAt: new Date("2024-06-01T09:25:00Z"),
    },
  ],

  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

export default messages;
