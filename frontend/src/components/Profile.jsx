import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiEdit } from "react-icons/fi";

import IndividualContactCard from "./IndividualContactCard/IndividualContactCard";
import EditProfileModal from "./Modals/EditProfileModal";

const Profile = ({ user, menuComponent }) => {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  return (
    <div className="flex-grow flex bg-slate-50 dark:bg-slate-700">
      {menuComponent}
      <div className="relative flex-grow flex justify-center items-start">
        <div className="flex-grow p-8 flex flex-col justify-start items-center">
          <div className="m-4 w-full flex justify-end">
            <button
              data-testid="edit-profile-button"
              onClick={() => setShowEditProfileModal(true)}
            >
              <FiEdit className="w-7 h-7 text-slate-700 dark:text-slate-100" />
            </button>
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
    </div>
  );
};

export default Profile;
