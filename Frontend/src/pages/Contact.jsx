import { NavLink, Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      {/* HEADER */}
      <header>
        <div className="container header-container">
          <div className="logo">
            <Link to="/dashboard">Startup Genius</Link>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="contact-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <nav>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>

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

            <NavLink to="/aichat" className={({ isActive }) => isActive ? "active" : ""}>
              AI Chatbot
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              About
            </NavLink>

          </nav>
        </aside>

        {/* MAIN */}
        <main className="container">
          <div className="content-page">
            <h2>Contact Us</h2>

            <div className="contact-list">

              <div className="contact-item">
                <h3>Muhammad Bilal</h3>
                <p>CMS: 60619</p>
                <p>Email: <a href="mailto:Bilal@buitems.com">Bilal@buitems.com</a></p>
              </div>

              <div className="contact-item">
                <h3>Mustafa</h3>
                <p>CMS: 61255</p>
                <p>Email: <a href="mailto:Mustafa@buitems.com">Mustafa@buitems.com</a></p>
              </div>

              <div className="contact-item">
                <h3>Asad Ullah</h3>
                <p>CMS: 61984</p>
                <p>Email: <a href="mailto:Asad@buitems.com">Asad@buitems.com</a></p>
              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Contact;