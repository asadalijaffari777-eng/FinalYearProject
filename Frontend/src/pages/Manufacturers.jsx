import { useEffect, useState } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import axios from "axios";
import "./Manufacturers.css";

function Manufacturers() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = location.search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:3001/fyp/manufacturers${query}`
        );

        setData(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="manufacturer-page">

      {/* HEADER */}
      <header>
        <div className="header-container">
          <Link to="/dashboard" className="logo">Startup Genius</Link>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="manufacturer-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav>
            <NavLink to="/start-business">Start Business</NavLink>
            <NavLink to="/manufacturers" className="active">Manufacturers</NavLink>
            <NavLink to="/aichat">AI Chatbot</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="container">
          <h2>Manufacturers</h2>

          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p>No manufacturers found.</p>
          ) : (
            <div className="grid">
              {data.map(m => (
                <div key={m._id} className="card">

                  {/* HEADER */}
                  <div className="card-header">
                    <h3>{m.name}</h3>
                    <span className={`badge ${m.type}`}>
                      {m.type}
                    </span>
                  </div>

                  {/* LOCATION */}
                  <p className="location">{m.location}</p>

                  {/* TAGS */}
                  <div className="tags">
                    {m.categories.map((cat, i) => (
                      <span key={i} className="tag">{cat}</span>
                    ))}
                  </div>

                  {/* INFO */}
                  <div className="info">
                    <p><strong>MOQ:</strong> {m.moq}</p>
                    <p><strong>Price:</strong> {m.priceRange}</p>
                  </div>

                  {/* LINKS */}
                  <div className="links">
                    {m.links?.website && (
                      <a href={m.links.website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                    {m.links?.instagram && (
                      <a href={m.links.instagram} target="_blank" rel="noreferrer">
                        Instagram
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Manufacturers;