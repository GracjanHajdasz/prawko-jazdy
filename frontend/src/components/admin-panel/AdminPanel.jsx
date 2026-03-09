import "./AdminPanel.css";

export default function AdminPanel() {
  return (
    <div className="admin-panel-container">
      <aside className="admin-panel-sidebar">
        <h2>Panel administratora</h2>
        <nav className="admin-panel-nav">
          <button>Kursanci</button>
          <button>Instruktorzy</button>
          <button>Kalendarz</button>
          <button>Faktury</button>
        </nav>
      </aside>
      <main className="admin-panel-content"></main>
    </div>
  );
}
