import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";

import { EDIT_SETTINGS } from "../graphql/mutations";
import Title from "./ui/Title";
import Button from "./ui/Button";
import ChangePasswordModal from "./Modals/ChangePasswordModal";

const SettingToggle = ({
  label,
  titleTestId,
  buttonTestId,
  isActive,
  onClick,
  activeColor = "#22c55e",
  inactiveColor = "#94a3b8",
}) => {
  return (
    <div className="w-full py-2 px-4 flex justify-between items-center rounded-lg bg-slate-200 dark:bg-slate-800">
      <p
        data-testid={titleTestId}
        className="text-mobile lg:text-base font-semibold text-slate-800 dark:text-slate-100"
      >
        {label}
      </p>

      <button data-testid={buttonTestId} onClick={onClick}>
        <div
          style={{
            backgroundColor: isActive ? activeColor : inactiveColor,
            justifyContent: isActive ? "flex-end" : "flex-start",
          }}
          className="w-14 sm:w-16 h-7 sm:h-8 flex justify-center rounded-full"
        >
          <div className="m-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100"></div>
        </div>
      </button>
    </div>
  );
};

const Settings = ({ user, menuComponent }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [theme, setTheme] = useState(user.settings.theme);
  const [time, setTime] = useState(user.settings.time);
  const [mutate] = useMutation(EDIT_SETTINGS);

  const handleToggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleToggleTimeFormat = () => {
    setTime((prevState) => (prevState === "12h" ? "24h" : "12h"));
  };

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
    <div
      data-testid="settings-page"
      className="flex-grow flex bg-slate-50 dark:bg-slate-700"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="p-4 flex-grow flex justify-center items-start">
        <div className="flex-grow max-w-[1000px] flex flex-col justify-start items-center gap-4">
          <Title variant="secondary" testId="settings-header" text="Settings" />
          <SettingToggle
            label={"Dark Mode"}
            titleTestId={theme === "dark" ? "dark-mode" : "light-mode"}
            buttonTestId="dark-mode-button"
            isActive={theme === "dark"}
            onClick={handleToggleDarkMode}
          />
          <SettingToggle
            label="24-Hour Clock"
            titleTestId={time === "24h" ? "24-hour-clock" : "12-hour-clock"}
            buttonTestId="time-format-button"
            isActive={time === "24h"}
            onClick={handleToggleTimeFormat}
          />
          <Button
            type="button"
            variant="tertiary"
            testId="change-password-button"
            text="Change Password"
            onClick={() => setShowChangePasswordModal(true)}
          />
          <AnimatePresence>
            {showChangePasswordModal && (
              <ChangePasswordModal
                setShowChangePasswordModal={setShowChangePasswordModal}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
