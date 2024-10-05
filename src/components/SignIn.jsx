import useField from "../../hooks/useField";
import { useNavigate } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/client";

import { LOGIN } from "../../graphql/mutations";
import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "./Notify";

const SignIn = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const username = useField("text", "Enter your username here...");
  const password = useField("password", "Enter your password here...");

  const showNotifyMessage = useNotifyMessage();

  const [mutate] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
      showNotifyMessage.show(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Logging in...");

    const { data } = await mutate({
      variables: { username: username.value, password: password.value },
    });

    console.log(data);

    if (data) {
      console.log("Logged in successfully!");
      localStorage.setItem("messaging-app-user-token", data.login.value);
      client.resetStore();
      navigate("/chats");
    }
  };

  const handleClickSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="flex-grow w-full flex justify-center items-center">
      <div
        className="flex-grow max-w-[500px] max-h-[600px] p-8 flex justify-center items-center
         bg-white bg-opacity-90 rounded-xl text-black shadow-xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex-grow h-full flex flex-col"
        >
          <h1
            className="text-2xl font-bold text-green-600"
            data-testid="sign-in-header"
          >
            Sign In
          </h1>
          <ul>
            <li className="my-4 w-full flex-grow flex flex-col">
              <Notify notifyMessage={showNotifyMessage} />
            </li>
            <li className="w-full flex-grow flex flex-col">
              <label className="text-md font-medium text-gray-700">
                USERNAME:
              </label>
            </li>
            <li className="mb-4 w-full flex-grow flex flex-col">
              <input
                className="w-full flex-grow p-2 rounded-lg bg-gray-200
                  focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 transition"
                {...username}
              />
              {username.value.length === 0 && (
                <span className="text-md text-red-500">
                  Please enter your username
                </span>
              )}
            </li>

            <li className="w-full flex-grow flex flex-col">
              <label className="text-md font-medium text-gray-700">
                PASSWORD:
              </label>
            </li>
            <li className="mb-4 w-full flex-grow flex flex-col">
              <input
                className="w-full flex-grow p-2 rounded-lg bg-gray-200
                  focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 transition"
                {...password}
              />
              {password.value.length === 0 && (
                <span className="text-md text-red-500">
                  Please enter your password
                </span>
              )}
            </li>

            <li className="my-4 w-full flex-grow flex flex-col">
              <button
                type="submit"
                className="flex-grow h-[70px] bg-green-500 border-2 border-green-500 rounded-xl text-xl font-bold text-white
                hover:bg-green-600 focus:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-95 transition"
              >
                Sign In
              </button>
            </li>
            <li className="my-4 w-full flex-grow flex flex-col">
              <span>Don't have an account?</span>
              <button
                onClick={handleClickSignUp}
                type="button"
                className="w-full flex-grow h-[70px] border-2 border-gray-400 rounded-xl text-xl font-bold text-gray-600
hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 transition"
              >
                Sign Up Here
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
