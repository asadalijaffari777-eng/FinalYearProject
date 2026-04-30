import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./AIChat.css";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMsg = { type: "user", text: message };

    setChat((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "This is a sample AI response." }
      ]);
    }, 500);

    setMessage("");
  };

  return (
    <div className="ai-page">

      {/* HEADER */}
      <header className="ai-header">
        <div className="header-container">
          <Link to="/dashboard" className="logo">Startup Genius</Link>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="ai-layout">

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <nav>
            <NavLink to="/start-business">Start Business</NavLink>
            <NavLink to="/manufacturers">Manufacturers</NavLink>
            <NavLink to="/aichat">AI Chat</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ai-container">

          {/* INPUT ALWAYS FIRST */}
          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>

          {/* CHAT HISTORY ONLY AFTER FIRST MESSAGE */}
          {chat.length > 0 && (
            <div className="chat-box">
              {chat.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AIChat;