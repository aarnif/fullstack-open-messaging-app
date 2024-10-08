import ProfileCard from "./ProfileCard";

const Profile = ({ user, menuComponent }) => {
  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex justify-center items-start">
        <div className="py-8 flex flex-col justify-start items-center">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
