import "./App.css";
import QueueItem from "./components/QueueItem.jsx";
import AddListPage from "./components/AddListPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import { useEffect, useState } from "react";

const tempArray = [1, 2, 3, 4, 5];

export default function App() {
  const [showAddListPage, setShowAddListPage] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [queueInfo, setQueueInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await window.electronAPI.getAllQueueItems();
      setQueueInfo(result);
      console.log(queueInfo);
    }

    fetchData();
  }, []);
  return (
    <>
      <div className="header-container">
        <h1 className="header-title">The Gym-Sales-Bot</h1>
        <div className="header-btn-container">
          <button
            className={`ui-btn ${
              !loginData.username || !loginData.password
                ? "incomplete-task"
                : ""
            }`}
            onClick={() => setShowLoginPage((prev) => !prev)}
          >
            Add Login Info
          </button>
          <button
            className="ui-btn"
            onClick={() => setShowAddListPage((prev) => !prev)}
          >
            Add To Queue
          </button>
        </div>
      </div>
      <div className="queue-container">
        {
          // queueInfo.map((element, index) => {
          //   return <QueueItem key={index} title={element.content.title} />;
          // })
          tempArray.map((element, index) => {
            return <QueueItem key={index} title={element} />;
          })
        }
      </div>
      {showAddListPage ? (
        <AddListPage setShowAddListPage={setShowAddListPage} />
      ) : null}
      {showLoginPage ? (
        <LoginPage
          setShowLoginPage={setShowLoginPage}
          loginData={loginData}
          setLoginData={setLoginData}
        />
      ) : null}
    </>
  );
}
