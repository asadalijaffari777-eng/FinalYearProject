import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Services/api";
import "./AIChatWidget.css";

export default function AIChatWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (location.pathname === "/aichat") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");

    const newMessages = [...messages, { type: "user", text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map((m) => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await API.post("/chat/message", { message: userMsg, history });
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: res.data.response,
          sources: res.data.sources || [],
          manufacturers: res.data.manufacturers || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "error", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openFullPage = () => {
    if (messages.length > 0) {
      sessionStorage.setItem("widgetChatTransfer", JSON.stringify(messages));
    }
    setIsOpen(false);
    navigate("/aichat");
  };

  return (
    <>
      <motion.button
        className="ai-widget-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="AI Assistant"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M12 2a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 014-4z"/>
          <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
          <path d="M9 12l3-2 3 2-3 2-3-2z"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="ai-widget-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setMinimized(false); }}
            />
            <motion.div
              className={`ai-widget-popup ${minimized ? "minimized" : ""}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="ai-widget-header">
                <div className="ai-widget-header-left">
                  <div className="ai-widget-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M12 2a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 014-4z"/>
                      <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="ai-widget-title">AI Assistant</div>
                    <div className="ai-widget-status">Online</div>
                  </div>
                </div>
                <div className="ai-widget-header-actions">
                  <button className="ai-widget-full-btn" onClick={openFullPage} title="Open full page">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                    </svg>
                  </button>
                  <button className="ai-widget-min-btn" onClick={() => setMinimized(!minimized)} title={minimized ? "Expand" : "Minimize"}>
                    {minimized ? "+" : "−"}
                  </button>
                  <button className="ai-widget-close-btn" onClick={() => { setIsOpen(false); setMinimized(false); }} title="Close">×</button>
                </div>
              </div>

              {!minimized && (
                <>
                  <div className="ai-widget-messages">
                    {messages.length === 0 && (
                      <div className="ai-widget-welcome">
                        <div className="ai-widget-welcome-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                            <path d="M12 2a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 014-4z"/>
                            <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                          </svg>
                        </div>
                        <p>Ask about manufacturers, products, or business advice!</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`ai-widget-msg ${msg.type}`}>
                        <div className="ai-widget-msg-text">{msg.text}</div>
                        {msg.manufacturers?.length > 0 && (
                          <div className="mfr-cards">
                            {msg.manufacturers.map((m, j) => (
                              <div key={j} className="mfr-card">
                                {m.image && <img src={m.image} alt={m.name} className="mfr-card-img" />}
                                <div className="mfr-card-body">
                                  <div className="mfr-card-name">{m.name}</div>
                                  <div className="mfr-card-detail"><span className="mfr-label">Location</span> {m.location}</div>
                                  <div className="mfr-card-detail"><span className="mfr-label">Categories</span> {(m.categories || []).join(", ")}</div>
                                  <div className="mfr-card-detail"><span className="mfr-label">MOQ</span> {m.moq} units</div>
                                  <div className="mfr-card-detail"><span className="mfr-label">Price</span> {m.priceRange}</div>
                                  <div className="mfr-card-links">
                                    {m.website && <a href={m.website} target="_blank" rel="noopener noreferrer" className="mfr-link">Website</a>}
                                    {m.instagram && <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="mfr-link">Instagram</a>}
                                    {m.email && <a href={`mailto:${m.email}`} className="mfr-link">Email</a>}
                                    {m.phone && <span className="mfr-link mfr-phone">{m.phone}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="ai-widget-msg bot">
                        <div className="ai-widget-typing">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form className="ai-widget-input-area" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      disabled={loading}
                    />
                    <button type="submit" disabled={loading || !input.trim()}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
