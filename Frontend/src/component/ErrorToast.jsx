import { useState, useEffect, useCallback } from "react";
import "./ErrorToast.css";

export default function ErrorToast({ message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onClose]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  if (!visible && !message) return null;

  return (
    <>
      <div className={`toast-overlay ${visible ? "show" : "hide"}`} onClick={handleClose} />
      <div className={`error-toast ${visible ? "show" : "hide"}`}>
        <div className="toast-top">
          <div className="error-toast-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span className="error-toast-text">{message || ""}</span>
          <button className="error-toast-close" onClick={handleClose}>×</button>
        </div>
      </div>
    </>
  );
}
