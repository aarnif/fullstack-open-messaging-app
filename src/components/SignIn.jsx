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
    <div>
      <form onSubmit={handleSubmit}>
        <h1 data-testid="sign-in-header">Sign In</h1>
        <ul>
          <Notify notifyMessage={showNotifyMessage} />
          <li>
            <label>USERNAME:</label>
          </li>
          <li>
            <input {...username} />
          </li>

          {username.value.length === 0 && (
            <li>
              <span>Please enter your username</span>
            </li>
          )}

          <li>
            <label>PASSWORD:</label>
          </li>
          <li>
            <input {...password} />
          </li>
          {password.value.length === 0 && (
            <li>
              <span>Please enter your password</span>
            </li>
          )}
          <li>
            <button type="submit">Sign In</button>
          </li>
          <li>
            <span>Don't have an account?</span>
            <button onClick={handleClickSignUp} type="button">
              Sign Up Here
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default SignIn;
