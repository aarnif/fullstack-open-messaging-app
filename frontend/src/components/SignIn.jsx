import useField from "../hooks/useField";
import { useNavigate } from "react-router";
import { useMutation, useApolloClient } from "@apollo/client";

import { LOGIN } from "../graphql/mutations";
import useNotifyMessage from "../hooks/useNotifyMessage";

import Title from "./ui/Title";
import Notify from "./Notify";
import Label from "./ui/Label";
import Input from "./ui/Input";
import Button from "./ui/Button";

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

    if (!username.value.length || !password.value.length) {
      showNotifyMessage.show("Please fill all fields.");
      return;
    }

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
        className="mx-4 w-full max-w-[450px] p-6 sm:p-8 flex justify-center items-center
         bg-white dark:bg-slate-800 rounded-xl text-black shadow-xl"
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Title type="primary" testId="sign-in-title" text="Sign In" />

          <div className="w-full flex flex-col gap-3">
            <Notify notifyMessage={showNotifyMessage} />

            <div className="w-full flex flex-col">
              <Label title="username" />
              <Input item={username} testId="username-input" />
            </div>

            <div className="w-full flex flex-col">
              <Label title="password" />
              <Input item={password} testId="password-input" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              testId="sign-in-button"
              text="Sign In"
            />

            <div className="w-full flex-grow flex flex-col">
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                Don&apos;t have an account?
              </span>
              <Button
                type="button"
                variant="secondary"
                testId="sign-up-button"
                text="Sign Up Here"
                onClick={handleClickSignUp}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
