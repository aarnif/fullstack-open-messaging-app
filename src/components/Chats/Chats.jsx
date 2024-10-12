const Chats = ({ menuComponent }) => {
  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex justify-center items-center">
        <div>Select Chat to Start Messaging.</div>
      </div>
    </div>
  );
};

export default Chats;
