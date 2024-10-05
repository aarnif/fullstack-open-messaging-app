import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-header flex flex-col justify-around items-center bg-green-600 p-2">
      <ul className="flex justify-center items-center">
        <li className="px-1">
          <h3 className="text-lg text-white font-bold">Created By aarnif</h3>
        </li>
        <li className="px-1">
          <motion.div
            whileHover={{
              scale: 1.5,
              rotate: 360,
            }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://github.com/aarnif"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon
                icon={faGithub}
                style={{ color: "white" }}
                size={"xl"}
              />
            </a>
          </motion.div>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
