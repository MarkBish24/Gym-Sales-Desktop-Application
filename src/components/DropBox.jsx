import desktopIcon from "../../assets/desktopIcon.ico";
import { useState } from "react";
import "./DropBox.css";

export default function DropBox() {
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

    const file = e.dataTransfer.files[0];

    if (file) {
      console.log("Dropped File:", file.name);
    }
  };

  return (
    <div
      className={`drop-zone ${isDragging ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <img src={desktopIcon} alt="Icon" className="drop-box-img" />
      <span>Drop Your File Here</span>
    </div>
  );
}
