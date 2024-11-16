const Notify = ({ notifyMessage }) => {
  if (!notifyMessage || !notifyMessage.content) {
    return null;
  }
  return (
    <div className="p-2 flex justify-center items-center bg-red-400 rounded-lg">
      <span className="text-md text-red-700">{notifyMessage.content}</span>
    </div>
  );
};

export default Notify;
