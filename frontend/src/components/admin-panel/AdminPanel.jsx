import { useState } from "react";
import "./AdminPanel.css";
import Calendar from "./content/Calendar";
import Students from "./content/students/Students";
import Instructors from "./content/Instructors";
import Invoices from "./content/Invoices";
import EditStudent from "./content/students/EditStudent";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("calendar");

  function displayContent(activeTab) {
    if (activeTab === "calendar") return <Calendar />;
    if (activeTab === "students") return <Students />;
    if (activeTab === "instructors") return <Instructors />;
    if (activeTab === "invoices") return <Invoices />;
  }

  return (
    <div className="admin-panel-container">
      <aside className="admin-panel-sidebar">
        <h2>Panel administratora</h2>
        <nav className="admin-panel-nav">
          <button
            className={activeTab === "calendar" ? "active" : ""}
            onClick={() => setActiveTab("calendar")}
          >
            Kalendarz
          </button>
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Kursanci
          </button>
          <button
            className={activeTab === "instructors" ? "active" : ""}
            onClick={() => setActiveTab("instructors")}
          >
            Instruktorzy
          </button>
          <button
            className={activeTab === "invoices" ? "active" : ""}
            onClick={() => setActiveTab("invoices")}
          >
            Faktury
          </button>
        </nav>
      </aside>
      <main className="admin-panel-content">{displayContent(activeTab)}</main>
    </div>
  );
}
