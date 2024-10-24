import SettingsCard from "./SettingsCard";

const Settings = ({ user, menuComponent }) => {
  return (
    <div className="flex-grow flex bg-slate-50 dark:bg-slate-700">
      {menuComponent}
      <div className="flex-grow flex justify-center items-start">
        <div className="flex-grow p-8 flex flex-col justify-start items-center">
          <SettingsCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
