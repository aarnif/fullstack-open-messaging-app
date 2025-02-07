const users = [
  {
    _id: "6690caa44dc3eac2b83517c7",
    username: "test",
    password: "password",
    name: "Test User",
    about: "Test user for development purposes.",
    status: "online",
    createdAt: new Date("2023-12-08T10:00:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517ca",
    username: "hiker_john",
    password: "password",
    name: "John Doe",
    about: "Love hiking and outdoor adventures.",
    image: {
      thumbnail: "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
      original:
        "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
    },
    status: "online",
    createdAt: new Date("2023-12-08T10:00:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517cc",
    username: "bookworm_jane",
    password: "password",
    name: "Jane Smith",
    about: "Avid reader and coffee enthusiast.",
    image: {
      thumbnail: "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
      original: "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
    },
    status: "offline",
    createdAt: new Date("2024-01-15T14:30:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517ce",
    username: "techie_alice",
    password: "password",
    name: "Alice Jones",
    about: "Tech geek and foodie.",
    image: {
      thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
      original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
    },
    status: "offline",
    createdAt: new Date("2024-03-22T08:45:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517d0",
    username: "music_bob",
    password: "password",
    name: "Bob Brown",
    about: "Musician and artist.",
    image: {
      thumbnail: "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
      original: "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
    },
    status: "online",
    createdAt: new Date("2024-05-28T16:20:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517d2",
    username: "streamer_charlie",
    password: "password",
    name: "Charlie Clark",
    about: "Gamer and streamer.",
    image: {
      thumbnail: "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
      original: "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
    },
    status: "online",
    createdAt: new Date("2024-06-01T10:00:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517d4",
    username: "fit_david",
    password: "password",
    name: "David Wilson",
    about: "Fitness enthusiast.",
    image: {
      thumbnail: "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
      original: "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
    },
    status: "offline",
    createdAt: new Date("2024-06-05T12:30:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517d6",
    username: "travel_emma",
    password: "password",
    name: "Emma Davis",
    about: "Travel blogger.",
    image: {
      thumbnail: "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
      original: "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
    },
    status: "online",
    createdAt: new Date("2024-06-10T14:45:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517d8",
    username: "history_frank",
    password: "password",
    name: "Frank Miller",
    about: "History buff.",
    image: {
      thumbnail: "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
      original: "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
    },
    status: "offline",
    createdAt: new Date("2024-06-15T16:00:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517da",
    username: "photo_grace",
    password: "password",
    name: "Grace Martin",
    about: "Photographer.",
    image: {
      thumbnail: "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
      original: "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
    },
    status: "online",
    createdAt: new Date("2024-06-20T18:15:00Z"),
  },
  {
    _id: "6690caa54dc3eac2b83517dc",
    username: "chef_harry",
    password: "password",
    name: "Harry Thompson",
    about: "Chef and food critic.",
    image: {
      thumbnail: "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
      original: "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
    },
    status: "offline",
    createdAt: new Date("2024-06-25T20:30:00Z"),
  },
];

// Add all users as contacts to the test user
users[0].contacts = users.slice(1);

export default users;
