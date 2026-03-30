import "./Calendar.css";
import { useState } from "react";
import "./Calendar.css";

const MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

export default function Calendar() {
  const today = new Date();
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selected, setSelected] = useState(null);

  const { year, month } = view;
  const firstDow = (() => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = () =>
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { ...v, month: v.month - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { ...v, month: v.month + 1 },
    );

  const cells = [];

  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: daysInPrev - firstDow + 1 + i, type: "other" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (firstDow + d - 1) % 7;
    cells.push({ day: d, type: dow >= 5 ? "weekend" : "normal" });
  }
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, type: "other" });
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button className="calendar__nav-btn" onClick={prevMonth}>
          ‹
        </button>
        <strong className="calendar__title">
          {MONTHS[month]} {year}
        </strong>
        <button className="calendar__nav-btn" onClick={nextMonth}>
          ›
        </button>
      </div>

      <div className="calendar__grid">
        {DAYS.map((d) => (
          <div key={d} className="calendar__day-name">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const isToday =
            cell.type !== "other" &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === cell.day;
          const isSel =
            selected &&
            selected.year === year &&
            selected.month === month &&
            selected.day === cell.day &&
            cell.type !== "other";

          const classes = [
            "calendar__cell",
            cell.type === "other" && "calendar__cell--other",
            cell.type === "weekend" && "calendar__cell--weekend",
            isToday && "calendar__cell--today",
            isSel && "calendar__cell--selected",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={i}
              className={classes}
              onClick={() =>
                cell.type !== "other" &&
                setSelected({ year, month, day: cell.day })
              }
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {selected && (
        <p className="calendar__selected-label">
          Wybrano: {selected.day} {MONTHS[selected.month]} {selected.year}
        </p>
      )}
    </div>
  );
}
