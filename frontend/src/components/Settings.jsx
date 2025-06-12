import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";

import { EDIT_SETTINGS } from "../graphql/mutations";
import ChangePasswordModal from "./Modals/ChangePasswordModal";

const EnableDarkMode = ({ theme, setTheme }) => {
  const handleToggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full mt-4 mx-4 py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 dark:bg-slate-800">
      <div
        data-testid={theme === "dark" ? "dark-mode" : "light-mode"}
        className="text-mobile lg:text-base font-semibold text-slate-800 dark:text-slate-100"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </div>
      <button data-testid="dark-mode-button" onClick={handleToggleDarkMode}>
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
        data-testid="time-format-button"
        onClick={() =>
          setTime((prevState) => (prevState === "12h" ? "24h" : "12h"))
        }
      >
        <div
          data-testid={time === "24h" ? "24-hour-clock" : "12-hour-clock"}
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

export const SettingsCard = ({ user }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
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
      <h2
        data-testid="settings-header"
        className="mt-4 mx-4 mb-2 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100"
      >
        Settings
      </h2>
      <EnableDarkMode theme={theme} setTheme={setTheme} />
      <ChangeClockFormat time={time} setTime={setTime} />
      <button
        data-testid="change-password-button"
        onClick={() => setShowChangePasswordModal(true)}
        className="my-4 w-full p-2 flex justify-center items-center text-mobile sm:text-base font-bold text-slate-800 dark:text-slate-100 border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
      >
        Change Password
      </button>
      <AnimatePresence>
        {showChangePasswordModal && (
          <ChangePasswordModal
            setShowChangePasswordModal={setShowChangePasswordModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Settings = ({ user, menuComponent }) => {
  return (
    <div
      data-testid="settings-page"
      className="flex-grow flex bg-slate-50 dark:bg-slate-700"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex justify-center items-start">
        <div className="flex-grow max-w-[1000px] p-8 flex flex-col justify-start items-center">
          <SettingsCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
