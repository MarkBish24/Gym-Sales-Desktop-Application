import "./App.css";
import QueueItem from "./components/QueueItem.jsx";
import AddListPage from "./components/AddListPage.jsx";
import { useEffect, useState } from "react";

const tempArray = [1, 2, 3, 4, 5];

export default function App() {
  const [showAddListPage, setShowAddListPage] = useState(false);
  return (
    <>
      <div className="header-container">
        <h1 className="header-title">The Gym-Sales-Bot</h1>
        <button
          className="add-to-queue-btn"
          onClick={() => setShowAddListPage((prev) => !prev)}
        >
          Add To Queue
        </button>
      </div>
      <div className="queue-container">
        {tempArray.map((element, index) => {
          return <QueueItem key={index} title={element} />;
        })}
      </div>
      {showAddListPage ? (
        <AddListPage setShowAddListPage={setShowAddListPage} />
      ) : null}
    </>
  );
}
