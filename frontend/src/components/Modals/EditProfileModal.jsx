import { useState } from "react";
import { useMutation } from "@apollo/client";
import { IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

import { EDIT_PROFILE } from "../../graphql/mutations";
import imageService from "../../services/imageService";
import ChangeImage from "../ChangeImage";
import useField from "../../hooks/useField";
import useModal from "../../hooks/useModal";

import Button from "../ui/Button";
import Title from "../ui/Title";
import Label from "../ui/Label";
import Input from "../ui/Input";

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

      if (base64Image && process.env.NODE_ENV !== "test") {
        console.log("Uploading profile picture...");
        result = await imageService.uploadImage(user.id, base64Image);
      }

      const newProfileImageInput = result?.data
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
        input: newProfileImageInput,
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

    if (!name.value) {
      modal(
        "alert",
        "Empty Profile Name",
        "Profile name cannot be empty!",
        "Close"
      );
      return;
    }

    modal(
      "success",
      "Update Profile",
      "Are you sure you want to update the profile?",
      "Update",
      handleSubmit
    );
  };

  return (
    <motion.div
      data-testid="edit-profile-modal"
      className="z-10 px-8 py-4 absolute inset-0 flex flex-col items-center bg-slate-50 dark:bg-slate-700 overflow-y-auto"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "100%", opacity: 1, duration: 0.2 }}
      exit={{ width: "0%", opacity: 0 }}
    >
      <div className="w-full flex-grow flex flex-col justify-center items-center gap-4">
        <div className="relative w-full flex items-center">
          <Button
            type="button"
            variant="return"
            testId="close-edit-profile-modal-button"
            onClick={goBack}
          />
          <div className="absolute left-1/2 -translate-x-1/2">
            <Title
              variant="secondary"
              testId="edit-profile-title"
              text="Edit Profile"
            />
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

          <div className="flex-grow flex flex-col gap-4">
            <div className="w-full flex flex-col">
              <Label title="profile name" />
              <Input item={name} testId="profile-name-input" />
            </div>

            <div className="w-full flex flex-col">
              <Label title="about" />
              <Input item={about} testId="profile-about-input" />
            </div>

            <Button
              type="submit"
              variant="tertiary"
              testId="submit-edit-profile-button"
              text="Edit Profile"
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfileModal;
