import { useState } from "react";

const useField = (type, placeholder) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    placeholder,
    onChange,
  };
};

export default useField;
