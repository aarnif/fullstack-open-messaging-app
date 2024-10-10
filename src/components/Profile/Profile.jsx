import IndividualContactCard from "../IndividualContactCard";

const Profile = ({ user, menuComponent }) => {
  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex justify-center items-start">
        <div className="flex-grow p-8 flex flex-col justify-start items-center">
          <IndividualContactCard user={user} contact={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
