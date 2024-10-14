const Contacts = ({ menuComponent }) => {
  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex justify-center items-center">
        <div>Select a contact for further information.</div>
      </div>
    </div>
  );
};

export default Contacts;
