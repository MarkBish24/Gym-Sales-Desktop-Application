import desktopIcon from "../../assets/desktopIcon.ico";
import { useState } from "react";
import "./DropBox.css";
import { div, span } from "framer-motion/client";
import { RxCross1 } from "react-icons/rx";

export default function DropBox({ file, setFile }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const isCsv =
      droppedFile.type === "text/csv" ||
      droppedFile.name.toLowerCase().endsWith(".csv");

    if (isCsv) {
      setFile(droppedFile);
      console.log("Dropped File:", droppedFile.name);
    } else {
      alert(
        "Please drop CSV files only. \nYou can download the appropriate member data off of the Gym Sales Website."
      );
    }
  };

  return (
    <>
      {file ? (
        <div className="file-uploaded">
          <span>{file.name}</span>
          <button className="file-delete-btn" onClick={() => setFile(null)}>
            <RxCross1 />
          </button>
        </div>
      ) : (
        <div
          className={`drop-zone ${isDragging ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img src={desktopIcon} alt="Icon" className="drop-box-img" />
          <span>Drop Your File Here!</span>
        </div>
      )}
    </>
  );
}
