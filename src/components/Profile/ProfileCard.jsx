const ProfileCard = ({ user }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mt-4 mx-4 mb-2">Profile</h2>
      <div className="w-full py-4 flex flex-col justify-center items-center">
        <img
          src={user.image.thumbnail}
          alt={`${user.name}'s profile`}
          style={{ width: "120px", height: "120px", borderRadius: "50%" }}
        />

        <p className="mt-4 text-xl text-slate-800 font-bold ">{user.name}</p>
        <p className="text-md text-slate-500 font-bold ">@{user.username}</p>
        <p className="mt-4 mx-8 text-base text-slate-700 text-center ">
          {user.about}
        </p>
      </div>
    </>
  );
};

export default ProfileCard;
