import config from "../config.js";

import emojiRegex from "emoji-regex";
import request from "supertest";

const checkIfMessageIsSingleEmoji = (messageContent) => {
  const regex = emojiRegex();
  let numberOfEmojis = 0;
  let numberofEmojiCharacters = 0;
  for (const match of messageContent.matchAll(regex)) {
    const emoji = match[0];
    numberOfEmojis += 1;
    numberofEmojiCharacters += emoji.length;
  }

  return (
    numberofEmojiCharacters === messageContent.length && numberOfEmojis === 1
  );
};

const requestData = async (queryData, token = "") =>
  await request(`http://localhost:${config.PORT}`)
    .post("/")
    .set("Authorization", token)
    .send(queryData);

export default { checkIfMessageIsSingleEmoji, requestData };
