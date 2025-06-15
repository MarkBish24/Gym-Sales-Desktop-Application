import { easeIn, easeOut, motion } from "framer-motion";
import { useState } from "react";

import "./AddListPage.css";
import DropBox from "./DropBox.jsx";

export default function AddListPage({ setShowAddListPage }) {
  const [message, setMessage] = useState(null);
  const [sendMode, setSendMode] = useState(false);

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
      <div className="main-ui-container">
        <div className="message-box-container">
          <label className="message-box-label" htmlFor="message">
            Insert the Message you want to Send!
          </label>
          <textarea
            className="message-box"
            id="message"
            name="message"
            rows="4"
            cols="50"
          ></textarea>
        </div>
        <div>
          <label className="message-box-label">
            Set Time for Text-Message!
          </label>
          <div className="send-mode-container">
            <label className="radio-btn">
              <input
                type="radio"
                name="send-mode"
                value="now"
                onClick={() => setSendMode(false)}
              />
              Send Now
            </label>
            <label className="radio-btn">
              <input
                type="radio"
                name="send-mode"
                value="later"
                onClick={() => setSendMode(true)}
              />
              Send Later
            </label>
          </div>
        </div>
        {sendMode ? <div className="set-time-container"></div> : null}
      </div>
    </motion.div>
  );
}
