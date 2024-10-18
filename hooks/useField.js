import { useState } from "react";

const useField = (type, placeholder, initialValue = "") => {
  const [value, setValue] = useState(initialValue);

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
