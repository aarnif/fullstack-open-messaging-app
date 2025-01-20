import { useState } from "react";
import { useMutation } from "@apollo/client";
import { IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

import { EDIT_PROFILE } from "../../graphql/mutations";
import imageService from "../../services/imageService";
import ChangeImage from "../ChangeImage";
import useField from "../../hooks/useField";
import useModal from "../../hooks/useModal";

const EditProfileModal = ({ user, setShowEditProfileModal }) => {
  const { modal } = useModal();
  const [base64Image, setBase64Image] = useState(null);
  const name = useField("text", "Enter profile name...", user.name);
  const about = useField(
    "text",
    "Tell something about yourself...",
    user.about
  );

  const [editProfile] = useMutation(EDIT_PROFILE, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const goBack = (event) => {
    event.preventDefault();
    console.log("Go back to profile page!");
    setShowEditProfileModal(false);
  };

  const handleSubmit = async () => {
    console.log("Handle submit edit profile...");

    try {
      let result;

      if (base64Image) {
        console.log("Uploading profile picture...");
        result = await imageService.uploadImage(user.id, base64Image);
      }

      const newProfileImage = base64Image
        ? {
            thumbnail: result.data.thumb.url,
            original: result.data.image.url,
          }
        : {
            thumbnail: user.image.thumbnail,
            original: user.image.original,
          };

      const newProfileData = {
        name: name.value,
        about: about.value,
        input: newProfileImage,
      };

      await editProfile({
        variables: newProfileData,
      });

      console.log("Edit profile success!");
    } catch (error) {
      console.log("Error editing profile:", error);
      console.log(error);
    }

    setShowEditProfileModal(false);
  };

  const handleClickSubmit = (event) => {
    event.preventDefault();
    modal(
      "confirm",
      "Are you sure you want to update the profile?",
      handleSubmit
    );
  };

  return (
    <>
      <motion.div
        className="z-10 absolute top-0 left-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-700"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "100%", opacity: 1, duration: 0.2 }}
        exit={{ width: "0%", opacity: 0 }}
      >
        <div className="w-full flex-grow p-8 flex flex-col">
          <div className="w-full flex-grow flex flex-col justify-center items-center">
            <div className="w-full flex justify-center items-center pb-4">
              <div className="w-[70px] flex justify-start items-center">
                <div className="w-8 h-8 rounded-full flex justify-center items-center">
                  <button onClick={goBack}>
                    <IoChevronBack className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-slate-100 fill-current" />
                  </button>
                </div>
              </div>
              <div className="flex-grow flex justify-center items-center">
                <h2 className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 font-bold">
                  Edit Profile
                </h2>
              </div>
              <div className="w-[70px] flex justify-end items-center">
                <div className="w-8 h-8 rounded-full flex justify-center items-center"></div>
              </div>
            </div>
            <form
              className="w-full flex-grow max-w-[1000px] flex flex-col"
              onSubmit={handleClickSubmit}
            >
              <ChangeImage
                currentImage={user.image.thumbnail}
                imageType={"profile"}
                setBase64Image={setBase64Image}
              />
              <ul className="flex-grow flex flex-col">
                <li className="w-full flex flex-col">
                  <label className="text-mobile lg:text-base font-bold text-slate-800 dark:text-slate-100">
                    Profile name:
                  </label>
                </li>
                <li className="w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="profile-name-input"
                    className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...name}
                  />
                </li>

                <li className="w-full flex flex-col">
                  <label className="text-mobile lg:text-base font-bold text-slate-800 dark:text-slate-100">
                    About:
                  </label>
                </li>
                <li className="w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="profile-about-input"
                    className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...about}
                  />
                </li>
                <li className="my-4 w-full flex justify-center items-end">
                  <button
                    data-testid="submit-edit-profile-button"
                    type="submit"
                    className="w-full max-h-[60px] p-2 flex justify-center items-center border-2 
                    border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
                    active:scale-95 rounded-xl transition"
                  >
                    <div className="text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                      Edit Profile
                    </div>
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EditProfileModal;
