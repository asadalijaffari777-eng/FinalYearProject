import { useState, useEffect, useCallback } from "react";
import "./ErrorToast.css";

export default function ErrorToast({ message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 200);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onClose]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  if (!visible && !message) return null;

  return (
    <div className={`error-toast ${visible ? "show" : "hide"}`}>
      <div className="error-toast-icon">!</div>
      <span className="error-toast-text">{message || ""}</span>
      <button className="error-toast-close" onClick={handleClose}>×</button>
    </div>
  );
}
