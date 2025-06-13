import "./QueueItem.css";

import { IoIosPlay, IoIosPause } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { useEffect, useState } from "react";

export default function QueueItem({ title }) {
  const [isPaused, setIsPaused] = useState(true);

  function ActivateBot() {
    setIsPaused((prev) => !prev);
  }

  return (
    <>
      <div className="queue-item">
        <span>Queue Item {title}</span>
        <div className="queue-btn-container">
          <button className="queue-btn pause-btn" onClick={ActivateBot}>
            {isPaused ? <IoIosPlay /> : <IoIosPause />}
          </button>
          <button className="queue-btn delete-btn">
            <AiFillDelete />
          </button>
        </div>
      </div>
    </>
  );
}
