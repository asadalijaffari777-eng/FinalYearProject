import { NavLink, Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* HEADER */}
      <header>
        <div className="container header-container">
          <div className="logo">
            <Link to="/dashboard">Startup Genius</Link>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="about-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <nav>
            <NavLink to="/dashboard">Home</NavLink>

            <NavLink
              to="/start-business"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Start Business
            </NavLink>

            <NavLink
              to="/manufacturers"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Manufacturers
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Contact
            </NavLink>

            <NavLink
              to="/aichat"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              AI Chatbot
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              About
            </NavLink>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="container">
          <div className="content-page">
            <h2>About Startup Genius</h2>

            <div className="about-content">
              <p>
                Startup Genius helps beginners launch and grow a clothing business
                with structured guidance and practical tools.
              </p>

              <h3>How It Works</h3>
              <p>
                You select clothing items, and the system guides you with:
              </p>

              <ul>
                <li><strong>Manufacturer suggestions</strong> based on your selections</li>
                <li><strong>Market insights</strong> to understand competition</li>
                <li><strong>Business direction</strong> for pricing and growth</li>
              </ul>

              <p>
                The goal is simple: remove confusion and give you a clear path to start.
              </p>

              <Link to="/start-business" className="btn">
                Start Your Business Journey
              </Link>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default About;