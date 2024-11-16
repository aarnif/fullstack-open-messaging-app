import Icon from "@mdi/react";
import { mdiCircleOutline, mdiLoading } from "@mdi/js";
import { motion } from "framer-motion";

const Loading = () => {
  const iconSize = 2.5;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ repeat: Infinity }}
        className="relative flex justify-center items-center"
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
    </div>
  );
};

export default Loading;
