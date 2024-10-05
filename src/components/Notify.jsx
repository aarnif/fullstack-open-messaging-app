const Notify = ({ notifyMessage }) => {
  if (!notifyMessage || !notifyMessage.content) {
    return null;
  }
  return <div className="text-red-500">{notifyMessage.content}</div>;
};

export default Notify;
