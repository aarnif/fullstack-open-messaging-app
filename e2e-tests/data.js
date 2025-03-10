const userCredentials = [];

for (let i = 1; i <= 5; i++) {
  userCredentials.push({
    username: `user${i}`,
    name: `User${i}`,
    password: "password",
    confirmPassword: "password",
  });
}

const user1Credentials = userCredentials[0];
const user2Credentials = userCredentials[1];
const user3Credentials = userCredentials[2];
const user4Credentials = userCredentials[3];
const user5Credentials = userCredentials[4];

export default {
  userCredentials,
  user1Credentials,
  user2Credentials,
  user3Credentials,
  user4Credentials,
  user5Credentials,
};
