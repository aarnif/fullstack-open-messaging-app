import useField from "../hooks/useField";
import { useNavigate } from "react-router";
import { useMutation, useApolloClient } from "@apollo/client";

import { CREATE_USER, LOGIN } from "../graphql/mutations";
import useNotifyMessage from "../hooks/useNotifyMessage";

import Title from "./ui/Title";
import Notify from "./Notify";
import Label from "./ui/Label";
import Input from "./ui/Input";
import Button from "./ui/Button";

const SignUp = ({ setActiveMenuItem }) => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const username = useField("text", "Enter your username here...");
  const password = useField("password", "Enter your password here...");
  const confirmPassword = useField("password", "Confirm your password here...");

  const showNotifyMessage = useNotifyMessage();

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
      showNotifyMessage.show(error.graphQLErrors[0].message);
    },
  });

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
      showNotifyMessage.show(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Trying to create a new user...");

    const { data } = await createUser({
      variables: {
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    });

    if (data) {
      console.log("User created successfully!");
      console.log("Logging in...");
      const { data } = await login({
        variables: { username: username.value, password: password.value },
      });
      console.log("Logged in successfully!");
      localStorage.setItem("messaging-app-user-token", data.login.value);
      client.resetStore();
      setActiveMenuItem("chats");
      navigate("/chats");
    }
  };

  const handleClickReturn = () => {
    navigate("/signin");
  };

  return (
    <div
      data-testid="sign-up-page"
      className="flex-grow w-full flex justify-center items-center"
    >
      <div
        className="mx-4 w-full max-w-[450px] p-6 sm:p-8 flex justify-center items-center
         bg-white dark:bg-slate-800 rounded-xl text-black shadow-xl"
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Title variant="primary" testId="sign-up-title" text="Sign Up" />

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

            <div className="w-full flex flex-col">
              <Label title="confirm password" />
              <Input item={confirmPassword} testId="confirm-password-input" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              testId="sign-up-submit-button"
              text="Sign Up"
            />

            <Button
              type="button"
              variant="secondary"
              testId="return-to-sign-in-button"
              text="Return to Sign In"
              onClick={handleClickReturn}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
