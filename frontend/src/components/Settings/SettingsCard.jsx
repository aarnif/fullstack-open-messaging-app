import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { EDIT_SETTINGS } from "../../graphql/mutations";

const EnableDarkMode = ({ theme, setTheme }) => {
  const handleToggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full mt-4 mx-4 py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 dark:bg-slate-800">
      <div className="text-mobile lg:text-base font-semibold text-slate-800 dark:text-slate-100">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </div>
      <button onClick={handleToggleDarkMode}>
        <div
          style={{
            backgroundColor: theme === "dark" ? "#22c55e" : "#94a3b8",
            justifyContent: theme === "dark" ? "flex-end" : "flex-start",
          }}
          className="w-14 sm:w-16 h-7 sm:h-8 flex justify-center rounded-full"
        >
          <div className="m-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100"></div>
        </div>
      </button>
    </div>
  );
};

const ChangeClockFormat = ({ time, setTime }) => {
  return (
    <div className="w-full mt-4 mx-4 py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 dark:bg-slate-800">
      <div className="text-mobile lg:text-base font-semibold text-slate-800 dark:text-slate-100">
        24-Hour Clock
      </div>
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
          className="w-14 sm:w-16 h-7 sm:h-8 flex justify-center rounded-full"
        >
          <div className="m-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100"></div>
        </div>
      </button>
    </div>
  );
};

const SettingsCard = ({ user }) => {
  const [theme, setTheme] = useState(user.settings.theme);
  const [time, setTime] = useState(user.settings.time);
  const [mutate] = useMutation(EDIT_SETTINGS);

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
  }, [mutate, theme, time, user.settings.theme, user.settings.time]);

  return (
    <>
      <h2 className="mt-4 mx-4 mb-2 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
        Settings
      </h2>
      <EnableDarkMode theme={theme} setTheme={setTheme} />
      <ChangeClockFormat time={time} setTime={setTime} />
    </>
  );
};

export default SettingsCard;
