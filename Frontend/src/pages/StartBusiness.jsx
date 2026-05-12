import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./StartBusiness.css";

const STORAGE_KEY = "businessSelections";

const ITEMS = {
  caps: [
    { id: "golf-cap", name: "Golf Cap", img: "/images/golf-cap.png" },
    { id: "basketball-cap", name: "Basketball Cap", img: "/images/basketball-cap.png" },
    { id: "ascot-cap", name: "Ascot Cap", img: "/images/ascot-cap.png" },
    { id: "winter-hat", name: "Winter Hat", img: "/images/winter-hat.png" }
  ],
  "upper-summer": [
    { id: "t-shirt", name: "T-Shirt", img: "/images/t-shirt.png" },
    { id: "school-shirt", name: "School Shirt", img: "/images/school-shirt.png" },
    { id: "polo-shirt", name: "Polo Shirt", img: "/images/polo-shirt.png" },
    { id: "sports-shirt", name: "Sports Shirt", img: "/images/sports-shirt.png" }
  ],
  "upper-winter": [
    { id: "jackets", name: "Jackets", img: "/images/jacket.png" },
    { id: "hoodies", name: "Hoodies", img: "/images/hoodies.png" }
  ],
  lower: [
    { id: "trousers", name: "Trousers", img: "/images/trousers.png" },
    { id: "jeans-pants", name: "Jeans Pants", img: "/images/jeans-pants.png" }
  ]
};

export default function StartBusiness() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelectedItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems));
  }, [selectedItems]);

  const toggleItem = (category, item) => {
    setSelectedItems(prev => {
      const exists = prev.find(
        i => i.id === item.id && i.category === category
      );

      if (exists) {
        return prev.filter(
          i => !(i.id === item.id && i.category === category)
        );
      }

      return [...prev, { ...item, category }];
    });
  };

  const isSelected = (category, id) =>
    selectedItems.some(i => i.id === id && i.category === category);

  const removeItem = (category, id) =>
    setSelectedItems(prev =>
      prev.filter(i => !(i.id === id && i.category === category))
    );

  const handleApply = () => {
    if (!selectedItems.length) return alert("Select at least one item");
    navigate("/aichat");
  };

  return (
    <div className="sb-page">

      {/* BACKGROUND (SAME AS HOME) */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER (NOW SAME STYLE AS HOME) */}
      <motion.header
        className="sb-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <Link to="/dashboard" className="logo">
          Startup Genius
        </Link>

        <motion.div
          className="sb-selected-badge"
          animate={{
            scale: selectedItems.length ? [1, 1.08, 1] : 1
          }}
        >
          {selectedItems.length} Selected
        </motion.div>
      </motion.header>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR (HOME STYLE) */}
      <motion.aside
        className="sidebar"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          mass: 1
        }}
      >
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/start-business">Start Business</NavLink>
          <NavLink to="/aichat">AI Chatbot</NavLink>
          <NavLink to="/manufacturers">Manufacturers</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <div className="sb-layout">

        <main className="sb-main">

          <motion.div
            className="sb-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Choose Your Products</h1>
            <p>Build your clothing business inventory professionally.</p>
          </motion.div>

          {Object.entries(ITEMS).map(([category, items]) => (
            <section className="sb-section" key={category}>

              <div className="section-head">
                <h3>{category.toUpperCase()}</h3>
                <span>
                  {selectedItems.filter(i => i.category === category).length} Selected
                </span>
              </div>

              <div className="sb-grid">
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    className={`sb-card ${
                      isSelected(category, item.id) ? "selected" : ""
                    }`}
                    onClick={() => toggleItem(category, item)}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="img-box">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="sb-card-footer">
                      <span>{item.name}</span>
                      <input
                        type="checkbox"
                        checked={isSelected(category, item.id)}
                        onChange={() => toggleItem(category, item)}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

            </section>
          ))}

        </main>

        {/* RIGHT PANEL (UNCHANGED LOGIC) */}
        <aside className="sb-right">

          <div className="sb-right-top">
            <div>
              <h3>Your Selection</h3>
              <p>{selectedItems.length} Products Selected</p>
            </div>

            <div className="selection-circle">
              {selectedItems.length}
            </div>
          </div>

          <div className="selected-list">
            {selectedItems.length === 0 ? (
              <p className="empty-selection">No items selected</p>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} className="sb-selected-item">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>

                  <button onClick={() => removeItem(item.category, item.id)}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <button className="sb-btn" onClick={handleApply}>
            Continue →
          </button>

        </aside>

      </div>
    </div>
  );
}