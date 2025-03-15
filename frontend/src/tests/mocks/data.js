import { LOGIN, CREATE_USER } from "../../graphql/mutations";
import { CURRENT_USER } from "../../graphql/queries";

const mockData = [
  {
    request: {
      query: LOGIN,
      variables: { username: "test", password: "password" },
    },
    result: {
      data: {
        login: {
          value: "fake-token-12345",
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER,
      variables: {
        username: "test",
        password: "password",
        confirmPassword: "password",
      },
    },
    result: {
      data: {
        createUser: {
          username: "test",
          name: "Test",
        },
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        me: {
          id: "6690caa44dc3eac2b83517c7",
          username: "test",
          name: "Test User",
          about: "Test user for development purposes.",
          image: {
            thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
            original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
          },
          settings: {
            theme: "light",
            time: "24h",
          },
          blockedContacts: [],
        },
      },
    },
  },
];

export default mockData;
