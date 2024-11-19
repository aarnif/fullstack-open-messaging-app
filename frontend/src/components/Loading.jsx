import Icon from "@mdi/react";
import { mdiCircleOutline, mdiLoading } from "@mdi/js";
import { motion } from "framer-motion";

const Loading = ({ maxHeight = null, loadingText = "" }) => {
  const iconSize = 2.5;
  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      style={{ maxHeight: maxHeight }}
    >
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ repeat: Infinity }}
        className="relative mb-12 flex justify-center items-center"
      >
        <Icon
          path={mdiCircleOutline}
          size={iconSize}
          className="absolute fill-current text-slate-500 opacity-70"
        />
        <Icon
          path={mdiLoading}
          size={iconSize}
          className="absolute fill-current text-slate-300"
        />
      </motion.div>
      <div className="text-slate-500">{loadingText}</div>
    </div>
  );
};

export default Loading;
