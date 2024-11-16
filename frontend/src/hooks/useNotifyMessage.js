import { useState } from "react";

const useNotifyMessage = () => {
  const [content, setContent] = useState(null);

  const show = (message) => {
    setContent(message);
    setTimeout(() => {
      setContent(null);
    }, 3000);
  };

  return { content, show };
};

export default useNotifyMessage;
