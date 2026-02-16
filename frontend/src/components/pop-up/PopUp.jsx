import "./PopUp.css";
import { useEffect, useState } from "react";

export default function PopUp({ popUpText, show, duration, setShowPopUp }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let autoCloseTimer;
    let removeTimer;

    if (show) {
      setIsVisible(true);
      setIsClosing(false);

      autoCloseTimer = setTimeout(() => {
        setIsClosing(true);

        removeTimer = setTimeout(() => {
          setIsVisible(false);
          if (typeof setShowPopUp === "function") setShowPopUp(false);
        }, 300);
      }, duration);
    }

    return () => {
      clearTimeout(autoCloseTimer);
      clearTimeout(removeTimer);
    };
  }, [show, duration, setShowPopUp]);

  if (!isVisible) return null;
  return (
    <div className={`popup ${isClosing ? "closing" : ""}`}>
      <h2>Komunikat</h2>
      <p>{popUpText}</p>
    </div>
  );
}
