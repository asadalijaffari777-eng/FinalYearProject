import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./AIChat.css";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;

    setChat((prev) => [...prev, { type: "user", text: userMsg }]);
    setMessage("");

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "This is a sample AI response." },
      ]);
    }, 500);
  };

  return (
    <div className="ai-page">

      {/* BACKGROUND GLOWS (same system as Home / SB) */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER (same style as StartBusiness) */}
      <motion.header
        className="ai-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="ai-header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <Link to="/dashboard" className="logo">
            Startup Genius
          </Link>
        </div>

        <div className="ai-badge">
          AI Assistant
        </div>
      </motion.header>

      {/* OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="overlay"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR (same as SB style) */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 110 }}
      >

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/start-business">Start Business</NavLink>
          <NavLink to="/manufacturers">Manufacturers</NavLink>
          <NavLink to="/aichat">AI Chat</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <main className="ai-container">

        <motion.div
          className="chat-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <div className="chat-header">
            <h2>AI Assistant</h2>
            <p>Ask anything. Get instant responses.</p>
          </div>

          <div className="chat-messages">
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          />

            <button type="submit">Send →</button>
          </form>

        </motion.div>
      </main>
    </div>
  );
}