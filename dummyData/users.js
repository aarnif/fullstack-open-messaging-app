import config from "../config.js";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(config.CLOUDINARY);

const users = [
  {
    username: "test",
    password: "password",
    name: "Test User",
    about: "Test user for development purposes.",
    status: "online",
    createdAt: new Date("2023-12-08T10:00:00Z"),
  },
  {
    username: "hiker_john",
    password: "password",
    name: "John Doe",
    about: "Love hiking and outdoor adventures.",
    profilePicture: cloudinary.url("hiker_john"),
    status: "online",
    createdAt: new Date("2023-12-08T10:00:00Z"),
  },
  {
    username: "bookworm_jane",
    password: "password",
    name: "Jane Smith",
    about: "Avid reader and coffee enthusiast.",
    profilePicture: cloudinary.url("bookworm_jane"),
    status: "offline",
    createdAt: new Date("2024-01-15T14:30:00Z"),
  },
  {
    username: "techie_alice",
    password: "password",
    name: "Alice Jones",
    about: "Tech geek and foodie.",
    profilePicture: cloudinary.url("techie_alice"),
    status: "offline",
    createdAt: new Date("2024-03-22T08:45:00Z"),
  },
  {
    username: "music_bob",
    password: "password",
    name: "Bob Brown",
    about: "Musician and artist.",
    profilePicture: cloudinary.url("music_bob"),
    status: "online",
    createdAt: new Date("2024-05-28T16:20:00Z"),
  },
  {
    username: "streamer_charlie",
    password: "password",
    name: "Charlie Clark",
    about: "Gamer and streamer.",
    profilePicture: cloudinary.url("streamer_charlie"),
    status: "online",
    createdAt: new Date("2024-06-01T10:00:00Z"),
  },
  {
    username: "fit_david",
    password: "password",
    name: "David Wilson",
    about: "Fitness enthusiast.",
    profilePicture: cloudinary.url("fit_david"),
    status: "offline",
    createdAt: new Date("2024-06-05T12:30:00Z"),
  },
  {
    username: "travel_emma",
    password: "password",
    name: "Emma Davis",
    about: "Travel blogger.",
    profilePicture: cloudinary.url("travel_emma"),
    status: "online",
    createdAt: new Date("2024-06-10T14:45:00Z"),
  },
  {
    username: "history_frank",
    password: "password",
    name: "Frank Miller",
    about: "History buff.",
    profilePicture: cloudinary.url("history_frank"),
    status: "offline",
    createdAt: new Date("2024-06-15T16:00:00Z"),
  },
  {
    username: "photo_grace",
    password: "password",
    name: "Grace Martin",
    about: "Photographer.",
    profilePicture: cloudinary.url("photo_grace"),
    status: "online",
    createdAt: new Date("2024-06-20T18:15:00Z"),
  },
  {
    username: "chef_harry",
    password: "password",
    name: "Harry Thompson",
    about: "Chef and food critic.",
    profilePicture: cloudinary.url("chef_harry"),
    status: "offline",
    createdAt: new Date("2024-06-25T20:30:00Z"),
  },
];

export default users;
