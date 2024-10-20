import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { EDIT_SETTINGS } from "../../graphql/mutations";

const EnableDarkMode = ({ theme, setTheme }) => {
  const handleToggleColorScheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="w-full mt-4 mx-4 py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 ">
      <div className="text-md font-semibold text-slate-700">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </div>
      <button onClick={handleToggleColorScheme}>
        <div
          style={{
            backgroundColor: theme === "dark" ? "#22c55e" : "#94a3b8",
            justifyContent: theme === "dark" ? "flex-end" : "flex-start",
          }}
          className="w-16 h-8 flex justify-center rounded-full bg-slate-400"
        >
          <div className="m-1 w-6 h-6 rounded-full bg-slate-100"></div>
        </div>
      </button>
    </div>
  );
};

const ChangeClockFormat = ({ time, setTime }) => {
  return (
    <div className="w-full mt-4 mx-4 py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 ">
      <div className="text-md font-semibold text-slate-700">24-Hour Clock</div>
      <button
        onClick={() =>
          setTime((prevState) => (prevState === "12h" ? "24h" : "12h"))
        }
      >
        <div
          style={{
            backgroundColor: time === "12h" ? "#94a3b8" : "#22c55e",
            justifyContent: time === "12h" ? "flex-start" : "flex-end",
          }}
          className="w-16 h-8 flex justify-center rounded-full bg-slate-400"
        >
          <div className="m-1 w-6 h-6 rounded-full bg-slate-100"></div>
        </div>
      </button>
    </div>
  );
};

const SettingsCard = ({ user }) => {
  const [theme, setTheme] = useState(user.settings.theme);
  const [time, setTime] = useState(user.settings.time);
  const [mutate] = useMutation(EDIT_SETTINGS);

  console.log("User settings:", theme, time);

  useEffect(() => {
    const updateUserSettings = async () => {
      if (theme === user.settings.theme && time === user.settings.time) {
        return;
      }
      const updatedSettings = {
        theme: theme,
        time: time,
      };
      console.log("Updating user settings:", updatedSettings);
      await mutate({
        variables: updatedSettings,
      });
    };
    updateUserSettings();
  }, [theme, time]);

  return (
    <>
      <h2 className="text-2xl font-bold mt-4 mx-4 mb-2">Settings</h2>{" "}
      <EnableDarkMode theme={theme} setTheme={setTheme} />
      <ChangeClockFormat time={time} setTime={setTime} />
    </>
  );
};

export default SettingsCard;
