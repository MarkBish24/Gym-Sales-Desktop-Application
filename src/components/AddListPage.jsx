import { easeIn, easeOut, motion } from "framer-motion";

import "./AddListPage.css";

export default function AddListPage({ setShowAddListPage }) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="add-list-page-container"
    >
      <div className="header-container">
        <h1 className="header-title">Add List Page</h1>
        <button
          className="add-to-queue-btn"
          onClick={() => setShowAddListPage((prev) => !prev)}
        >
          Leave
        </button>
      </div>
    </motion.div>
  );
}
