import { easeIn, easeOut, motion } from "framer-motion";
import { useState } from "react";

import "./AddListPage.css";
import DropBox from "./DropBox.jsx";
import { option } from "framer-motion/client";
import Calendar from "react-calendar";

export default function AddListPage({ setShowAddListPage }) {
  const [message, setMessage] = useState(null);
  const [sendMode, setSendMode] = useState(false);
  const [sendTime, setSendTime] = useState(null);
  const [date, setDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generateTimes = () => {
    const times = [];
    for (let hour = 4; hour <= 12; hour++) {
      times.push(`${hour}:00 AM`);
      times.push(`${hour}:30 AM`);
    }
    for (let hour = 1; hour <= 10; hour++) {
      times.push(`${hour}:00 PM`);
      times.push(`${hour}:30 PM`);
    }
    return times;
  };
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
          className="ui-btn"
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
          <label className="message-box-label">Send Now or Later</label>
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
        {sendMode ? (
          <div className="set-time-container">
            <label className="message-box-label">
              Set Time for Text-Message!
            </label>
            <div className="set-time-btns">
              <label>Select a Time</label>
              <select>
                {generateTimes().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <label>Select a Date</label>
              <Calendar
                onChange={setDate}
                value={date}
                tileDisabled={({ date }) => {
                  return date <= today;
                }}
                formatShortWeekday={(locale, date) => {
                  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
                  return weekdays[date.getDay()];
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
