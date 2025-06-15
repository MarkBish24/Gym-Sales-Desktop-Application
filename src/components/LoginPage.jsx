import { easeIn, easeOut, motion } from "framer-motion";

import "./LoginPage.css";

export default function LoginPage({
  setShowLoginPage,
  loginData,
  setLoginData,
}) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="login-page-container"
    >
      <div className="header-container">
        <h1 className="header-title">Set Login Info</h1>
        <button
          className="ui-btn"
          onClick={() => setShowLoginPage((prev) => !prev)}
        >
          Leave
        </button>
      </div>
      <div className="login-description">
        <span>
          In order for the Gym-Sales-Bot to function, it needs your username and
          password to login into Gym Sales so it can send out text-messages to
          members.
        </span>
      </div>
      <div className="login-info">
        <div className="login-item">
          <span>Username</span>
          <input
            type="text"
            value={loginData.username || ""}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
        </div>
        <div className="login-item">
          <span>Password</span>
          <input
            type="password"
            value={loginData.password || ""}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
