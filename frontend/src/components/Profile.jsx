import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import IndividualContactCard from "./ui/IndividualContactCard";
import EditProfileModal from "./Modals/EditProfileModal";
import Button from "./ui/Button";

// Add go back button to mobile view
const Profile = ({ user, menuComponent }) => {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  return (
    <div
      data-testid="profile"
      className="flex-grow flex bg-slate-50 dark:bg-slate-700"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="p-4 relative flex-grow flex flex-col justify-start items-center gap-4">
        <div className="w-full flex justify-end">
          <Button
            type="button"
            variant="edit-profile"
            testId="edit-profile-button"
            onClick={() => setShowEditProfileModal(true)}
          />
        </div>
        <IndividualContactCard user={user} contact={user} />
        <AnimatePresence>
          {showEditProfileModal && (
            <EditProfileModal
              user={user}
              setShowEditProfileModal={setShowEditProfileModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
