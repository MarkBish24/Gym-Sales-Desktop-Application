import "./QueueItem.css";

import { IoIosPlay, IoIosPause } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { useEffect, useState } from "react";

export default function QueueItem({ element }) {
  const info = element.info;
  const [isPaused, setIsPaused] = useState(true);

  function ActivateBot() {
    setIsPaused((prev) => !prev);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${element.folder}"?`
    );
    if (!confirmed) return;

    window.electronAPI.deleteQueueItem(element.folder);
    window.location.reload();
  }

  return (
    <>
      <div className="queue-item">
        <div className="queue-item-title-cntr">
          <span className="queue-item-title"> {info.title}</span>
          <div className="download-bar">
            <div
              className="download-bar-fill active"
              style={{
                width:
                  info.members > 0
                    ? `${Math.min((info.sent / info.members) * 100, 100)}%`
                    : "0%",
              }}
            ></div>
            <span className="download-bar-label">
              {info.sent} / {info.members}
            </span>
          </div>
        </div>
        <div className="queue-btn-container">
          <button className="queue-btn pause-btn" onClick={ActivateBot}>
            {isPaused ? <IoIosPlay /> : <IoIosPause />}
          </button>
          <button className="queue-btn delete-btn" onClick={handleDelete}>
            <AiFillDelete />
          </button>
        </div>
      </div>
    </>
  );
}
