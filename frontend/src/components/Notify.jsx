const Notify = ({ notifyMessage }) => {
  if (!notifyMessage || !notifyMessage.content) {
    return null;
  }
  return (
    <div
      data-testid="notify-message"
      className="w-full p-2 flex justify-center items-center text-md text-red-700 bg-red-400 rounded-lg"
    >
      {notifyMessage.content}
    </div>
  );
};

export default Notify;
