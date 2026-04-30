import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
    { id: "winter-upper", name: "Winter Upper", img: "/images/winter-upper.png" },
    { id: "sweat-shirt", name: "Sweat Shirt", img: "/images/sweat-shirt.png" },
    { id: "hoodies", name: "Hoodies", img: "/images/hoodies.png" }
  ],
  lower: [
    { id: "trousers", name: "Trousers", img: "/images/trousers.png" },
    { id: "nicker", name: "Nicker", img: "/images/nicker.png" },
    { id: "warm-pants", name: "Warm Pants", img: "/images/warm-pants.png" },
    { id: "jeans-pants", name: "Jeans Pants", img: "/images/jeans-pants.png" },
    { id: "leggings", name: "Leggings", img: "/images/leggings.png" }
  ],
  inner: [
    { id: "cotton-vest", name: "Cotton Vest", img: "/images/cotton-vest.png" },
    { id: "underwear", name: "Underwear", img: "/images/underwear.png" }
  ],
  socks: [
    { id: "long-socks", name: "Long Socks", img: "/images/long-socks.png" },
    { id: "short-socks", name: "Short Socks", img: "/images/short-socks.png" }
  ]
};

export default function StartBusiness() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSelectedItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ✅ SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems));
  }, [selectedItems]);

  // ✅ TOGGLE SELECTION
  const toggleItem = (category, id, name, img) => {
    setSelectedItems(prev => {
      const exists = prev.some(
        i => i.category === category && i.id === id
      );

      if (exists) {
        return prev.filter(
          i => !(i.category === category && i.id === id)
        );
      }

      return [...prev, { category, id, name, img }];
    });
  };

  // ✅ CHECK SELECTED
  const isSelected = (category, id) =>
    selectedItems.some(i => i.category === category && i.id === id);

  // ✅ APPLY → SEND ITEM IDS (CLEAN)
  const handleApply = () => {
    if (!selectedItems.length) {
      alert("Select at least one item.");
      return;
    }

    const items = selectedItems.map(i => i.id).join(",");

    console.log("Sending items:", items);

    // navigate(`/manufacturers?items=${items}`);
    navigate('/aichat')
  };

  return (
    <div className="business-page">

      {/* HEADER */}
      <header>
        <div className="container header-container">
          <div className="logo">
            <Link to="/dashboard">Startup Genius</Link>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="business-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav>
            <NavLink to="/dashboard">Home</NavLink>
            <NavLink to="/start-business">Start Business</NavLink>
            <NavLink to="/manufacturers">Manufacturers</NavLink>
            <NavLink to="/aichat">AI Chatbot</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="container">
          <h2>Start Your Clothing Business</h2>

          {Object.entries(ITEMS).map(([category, items]) => (
            <div key={category} className="category">
              <h3>{category.replace(/-/g, " ").toUpperCase()}</h3>

              <div className="options-grid">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`option-card ${
                      isSelected(category, item.id) ? "selected" : ""
                    }`}
                    onClick={() =>
                      toggleItem(category, item.id, item.name, item.img)
                    }
                  >
                    <img src={item.img} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* SELECTED ITEMS */}
          <div className="selected-items">
            <h3>Your Selections</h3>

            <div className="selected-grid">
              {selectedItems.length === 0 ? (
                <p style={{ color: "#969595" }}>No items selected</p>
              ) : (
                selectedItems.map((item, index) => (
                  <div key={index} className="selected-item">
                    <img src={item.img} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* APPLY BUTTON */}
          <div className="apply-container">
            <button className="btn" onClick={handleApply}>
              Apply
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}