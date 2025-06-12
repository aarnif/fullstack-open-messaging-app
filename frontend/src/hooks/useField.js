import { useState } from "react";

const useField = (type, placeholder, initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onReset = () => {
    setValue("");
  };

  return {
    type,
    value,
    placeholder,
    setValue,
    onChange,
    onReset,
  };
};

export default useField;
