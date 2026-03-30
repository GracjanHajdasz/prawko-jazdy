import "./ConfirmationPanel.css";
import Slot from "./slot/Slot";

export default function ConfirmationPanel({ lessons }) {
  const availableLessons = lessons.filter(
    (lesson) => lesson.status === "available",
  );

  return (
    <div className="confirmation-panel">
      {availableLessons.length === 0 ? (
        <p>brak wolnych godzin w tym dniu</p>
      ) : (
        <>
          <p style={{ marginBottom: "16px" }}>Dostępne godziny:</p>
          <div className="confirmation-panel__slots">
            {availableLessons.map((lesson) => (
              <Slot
                key={lesson.data.slice(11, 16)}
                time={lesson.data.slice(11, 16)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
