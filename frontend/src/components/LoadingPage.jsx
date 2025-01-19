import { motion } from "framer-motion";
import Loading from "./Loading";

const LoadingPage = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <Loading loadingText="Loading page..." />
      <h1 className="fixed bottom-16 text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 font-bold">
        Messaging App
      </h1>
    </motion.div>
  );
};

export default LoadingPage;
