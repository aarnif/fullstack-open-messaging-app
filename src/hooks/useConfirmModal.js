import { useContext } from "react";
import ConfirmModalContext from "../contexts/ConfirmModalContext";

const useConfirmModal = () => {
  return useContext(ConfirmModalContext);
};

export default useConfirmModal;
