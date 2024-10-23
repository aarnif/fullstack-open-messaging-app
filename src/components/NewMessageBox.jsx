import { FaRegSmile } from "react-icons/fa";
import { MdSend } from "react-icons/md";

const NewMessageBox = ({ message, setMessage, handleSubmit }) => {
  return (
    <div className="w-full h-[50px] p-2 flex bg-white text-slate-800">
      <input
        className="w-full p-2 bg-slate-100 rounded-xl"
        placeholder="New Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="mx-2 flex justify-center items-center">
        <button onClick={handleSubmit}>
          <MdSend size={26} color="#16a34a" />
        </button>
      </div>
    </div>
  );
};

export default NewMessageBox;
