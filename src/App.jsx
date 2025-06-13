import "./App.css";
import QueueItem from "./components/QueueItem.jsx";

const tempArray = [1, 2, 3, 4, 5];

export default function App() {
  return (
    <>
      <div className="header-container">
        <h1 className="header-title">The Gym-Sales-Bot</h1>
        <button className="add-to-queue-btn">Add To Queue</button>
      </div>
      <div className="queue-container">
        {tempArray.map((element, index) => {
          return <QueueItem key={index} title={element} />;
        })}
      </div>
    </>
  );
}
