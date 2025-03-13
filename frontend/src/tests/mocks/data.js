import { LOGIN, CREATE_USER } from "../../graphql/mutations";

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
];

export default mockData;
