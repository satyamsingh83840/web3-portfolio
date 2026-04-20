import React from "react";
import { motion } from "framer-motion";

export default function FadeIn({ children, delay = 0 }:{children:React.ReactNode,delay:number}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}