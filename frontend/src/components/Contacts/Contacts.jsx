const Contacts = ({ menuComponent }) => {
  return (
    <div data-testid="contacts-page" className="flex-grow flex">
      {menuComponent}
      <div className="hidden flex-grow lg:flex justify-center items-center">
        <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold">
          Select a contact for further information.
        </div>
      </div>
    </div>
  );
};

export default Contacts;
