import "./Slot.css";
import { useState } from "react";

export default function Slot({ time }) {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive((v) => !v);
  }

  return (
    <div onClick={handleClick} className={"slot" + (isActive ? "-active" : "")}>
      {time}
    </div>
  );
}
