import { useContext } from "react";
import ConfirmModalContext from "../contexts/ConfirmModalContext";

const useModal = () => {
  return useContext(ConfirmModalContext);
};

export default useModal;
