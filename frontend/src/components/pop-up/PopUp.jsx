import "./PopUp.css"
import { useEffect, useState } from "react"

export default function PopUp({ popUpText, show, duration, setShowPopUp }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        let autoCloseTimer;
        let removeTimer;

        if (show) {
            setIsVisible(true);
            setIsClosing(false);

            // Auto-close after specified duration
            autoCloseTimer = setTimeout(() => {
                setIsClosing(true);

                // Remove from DOM after closing animation
                removeTimer = setTimeout(() => {
                    setIsVisible(false);
                    if (typeof setShowPopUp === 'function') setShowPopUp(false);
                }, 300); // closing animation time
            }, duration);
        }

        return () => {
            clearTimeout(autoCloseTimer);
            clearTimeout(removeTimer);
        };
    }, [show, duration, setShowPopUp]);

    if (!isVisible) return null;
    return (
        <div className={`popup ${isClosing ? 'closing' : ''}`}>
            <h2>Komunikat</h2>
            <p>{popUpText}</p>
        </div>
    )
}