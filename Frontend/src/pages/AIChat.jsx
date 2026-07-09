import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Services/api";
import "./AIChat.css";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const transfer = sessionStorage.getItem("widgetChatTransfer");
    if (transfer) {
      try {
        const msgs = JSON.parse(transfer);
        if (Array.isArray(msgs) && msgs.length > 0) {
          setChat(msgs);
          sessionStorage.removeItem("widgetChatTransfer");
          return;
        }
      } catch { /* ignore */ }
    }

    const selections = localStorage.getItem("businessSelections");
    if (selections) {
      try {
        const parsed = JSON.parse(selections);
        const items = Array.isArray(parsed) ? parsed : parsed?.items || [];
        if (items.length > 0) {
          const names = items.map(i => i.name).join(", ");
          loadConversations();
          setTimeout(() => sendMessage(`Find manufacturers for these clothing items and tell me about them: ${names}`, false), 300);
          return;
        }
      } catch { /* ignore */ }
    }

    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await API.get("/chat/history");
      setConversations(res.data?.chats || []);
    } catch { /* ignore */ }
  };

  const loadConversation = async (id) => {
    try {
      const res = await API.get(`/chat/history/${id}`);
      const conv = res.data?.chat;
      if (conv?.messages) {
        const msgs = conv.messages.filter(m => m.role !== "system").map(m => ({
          type: m.role === "user" ? "user" : "bot",
          text: m.content,
          sources: m.sources || [],
        }));
        setChat(msgs);
        setChatId(conv._id);
      }
      setHistoryOpen(false);
    } catch { /* ignore */ }
  };

  const newChat = () => {
    setChat([]);
    setChatId(null);
    setMessage("");
  };

  const sendMessage = async (text, pushToChat = true) => {
    const msgText = text || message;
    if (!msgText.trim() || loading) return;

    const userMsg = msgText;
    if (pushToChat) setMessage("");

    const newMessages = [...chat, { type: "user", text: userMsg }];
    setChat(newMessages);
    setLoading(true);

    const history = newMessages.map(m => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.text,
    }));

    let selections = [];
    try {
      const raw = localStorage.getItem("businessSelections");
      if (raw) {
        const parsed = JSON.parse(raw);
        selections = Array.isArray(parsed) ? parsed : parsed?.items || [];
      }
    } catch { /* ignore */ }

    try {
      const res = await API.post("/chat/message", {
        message: userMsg,
        history,
        businessSelections: selections,
        chatId,
      });
      setChat(prev => [...prev, {
        type: "bot",
        text: res.data.response,
        sources: res.data.sources || [],
        manufacturers: res.data.manufacturers || [],
      }]);
      if (res.data.chatId) setChatId(res.data.chatId);
      loadConversations();
    } catch (err) {
      setChat(prev => [...prev, {
        type: "error",
        text: err.response?.data?.message || "Something went wrong. Try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message, true);
  };

  const selectConversation = async (conv) => {
    if (conv._id === chatId) return;
    await loadConversation(conv._id);
  };

  return (
    <div className="ai-page">

      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

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

        <div className="ai-header-actions">
          <button className="ai-history-btn" onClick={() => setHistoryOpen(true)} title="Chat History">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
          {chatId && (
            <button className="ai-newchat-btn" onClick={newChat} title="New Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          )}
          <div className="ai-badge">AI Assistant</div>
        </div>
      </motion.header>

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

      {historyOpen && (
        <>
          <div className="overlay" onClick={() => setHistoryOpen(false)} />
          <motion.aside
            className="ai-history-panel"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
          >
            <div className="ai-history-header">
              <h3>Chat History</h3>
              <button className="ai-close-btn" onClick={() => setHistoryOpen(false)}>×</button>
            </div>
            <div className="ai-history-list">
              {conversations.length === 0 && <p className="empty-history">No conversations yet</p>}
              {conversations.map(conv => (
                <div
                  key={conv._id}
                  className={`ai-history-item ${conv._id === chatId ? "active" : ""}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="ai-history-title">{conv.title || "New Chat"}</div>
                  <div className="ai-history-date">{new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}

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

      <main className="ai-container">
        <motion.div
          className="chat-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="chat-header">
            <div>
              <h2>AI Assistant</h2>
              <p>Ask about manufacturers, products, or business advice.</p>
            </div>
            {chatId && (
              <button className="new-chat-btn" onClick={newChat}>+ New Chat</button>
            )}
          </div>

          <div className="chat-messages">
            {chat.length === 0 && (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <path d="M12 2a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 014-4z"/>
                    <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                  </svg>
                </div>
                <h3>How can I help you?</h3>
                <p>Ask about manufacturers for specific products, get business advice, or explore clothing industry insights.</p>
              </div>
            )}
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="chat-msg-text">{msg.text}</div>
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
                {(!msg.manufacturers || msg.manufacturers.length === 0) && msg.sources?.length > 0 && (
                  <div className="chat-sources">
                    {msg.sources.map((s, j) => (
                      <span key={j} className="source-tag">{s}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()}>Send →</button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
