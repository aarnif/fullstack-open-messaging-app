import useField from "../hooks/useField";
import { useNavigate } from "react-router";
import { useMutation, useApolloClient } from "@apollo/client";

import { LOGIN } from "../graphql/mutations";
import useNotifyMessage from "../hooks/useNotifyMessage";
import Notify from "./Notify";

const SignIn = ({ setActiveMenuItem }) => {
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

    if (data) {
      console.log("Logged in successfully!");
      localStorage.setItem("messaging-app-user-token", data.login.value);
      client.resetStore();
      setActiveMenuItem("chats");
      navigate("/chats");
    }
  };

  const handleClickSignUp = () => {
    navigate("/signup");
  };

  return (
    <div
      data-testid="sign-in-page"
      className="flex-grow w-full flex justify-center items-center"
    >
      <div
        className="flex-grow max-w-[500px] max-h-[600px] p-8 flex justify-center items-center
         lg:bg-white dark:bg-slate-800 bg-opacity-90 lg:rounded-xl text-black lg:shadow-xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex-grow h-full flex flex-col"
        >
          <h1
            data-testid="sign-in-title"
            className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100"
          >
            Sign In
          </h1>
          <ul>
            <li className="my-4 w-full flex-grow flex flex-col">
              <Notify notifyMessage={showNotifyMessage} />
            </li>

            <li className="w-full flex-grow flex flex-col">
              <label className="text-mobile sm:text-base font-medium text-slate-700 dark:text-slate-200">
                USERNAME:
              </label>
            </li>
            <li className="w-full flex-grow flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
              <input
                data-testid="username-input"
                className="w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                {...username}
              />
            </li>
            <li>
              {username.value.length === 0 && (
                <span className="pl-[10px] text-mobile sm:text-base text-red-500">
                  Please enter your username
                </span>
              )}
            </li>

            <li className="w-full flex-grow flex flex-col">
              <label className="text-mobile sm:text-base font-medium text-slate-700 dark:text-slate-200">
                PASSWORD:
              </label>
            </li>

            <li className="w-full flex-grow flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
              <input
                data-testid="password-input"
                className="w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                {...password}
              />
            </li>
            <li>
              {password.value.length === 0 && (
                <span className="pl-[10px] text-mobile sm:text-base text-red-500">
                  Please enter your password
                </span>
              )}
            </li>

            <li className="my-4 w-full flex-grow flex flex-col">
              <button
                type="submit"
                data-testid="sign-in-button"
                className="flex-grow py-4 sm:py-6 bg-green-500 border-2 border-green-500 rounded-xl
                hover:bg-green-600 focus:bg-green-600 active:scale-95 transition"
              >
                <div className="text-lg sm:text-xl font-bold text-white">
                  Sign In
                </div>
              </button>
            </li>
            <li className="my-4 w-full flex-grow flex flex-col ">
              <span className="text-slate-700 dark:text-slate-200">
                Don&apos;t have an account?
              </span>
              <button
                onClick={handleClickSignUp}
                type="button"
                data-testid="sign-up-button"
                className="w-full flex-grow py-4 sm:py-6 border-2 border-slate-400 rounded-xl
hover:bg-slate-300 dark:hover:bg-slate-900 focus:bg-slate-300 active:scale-95 transition"
              >
                <div className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300">
                  Sign Up Here
                </div>
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
