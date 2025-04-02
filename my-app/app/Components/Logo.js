import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Logo = ({extraClasses = ""}) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src="/assets/devday_diamond_2.png"
        alt="Logo"
        width={55}
        height={55}
        className={`mr-4 mix-blend-lighten rounded-full ${extraClasses}`}
      />
    </motion.div>
  );
};

export default Logo;
