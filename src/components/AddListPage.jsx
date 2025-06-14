import { easeIn, easeOut, motion } from "framer-motion";
import { useState } from "react";

import "./AddListPage.css";
import DropBox from "./DropBox.jsx";

export default function AddListPage({ setShowAddListPage }) {
  const [message, setMessage] = useState(null);
  const [sendMode, setSendMode] = useState(null);

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
      <DropBox />
      <textarea id="message"></textarea>
      <div>
        <label>
          <input type="radio" name="now" />
          Send Now
        </label>
        <label>
          <input type="radio" name="later" />
          Send Later
        </label>
      </div>
    </motion.div>
  );
}
