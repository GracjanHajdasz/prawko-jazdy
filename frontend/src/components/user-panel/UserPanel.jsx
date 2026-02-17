import "./UserPanel.css";
import { useState } from "react";

export default function UserPanel() {
  const [activeTab, setActiveTab] = useState("profile");

  const userData = {
    name: "Jan Kowalski",
    pkk: "123456789012345",
    category: "B",
    hoursDriven: 18,
    hoursTotal: 30,
    nextRide: "17.02.2026, 14:00",
    instructor: "Marek Nowak",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection data={userData} />;
        case "schedule":
        return <ScheduleSection />;
      case "stats":
        return <StatsSection data={userData} />;
      default:
        return <StatsSection data={userData} />;
    }
  };

  return (
    <div className="panel-container">
      <aside className="panel-sidebar">
        <div className="user-brief">
          <div className="avatar-placeholder">{userData.name.charAt(0)}</div>
          <h3>{userData.name}</h3>
          <p>Kursant kat. {userData.category}</p>
        </div>

        <nav className="panel-nav">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Moje dane
          </button>
          <button
            className={activeTab === "schedule" ? "active" : ""}
            onClick={() => setActiveTab("schedule")}
          >
            Umówione jazdy
          </button>
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => setActiveTab("stats")}
          >
            Statystyki
          </button>
        </nav>
      </aside>

      <main className="panel-content">{renderContent()}</main>
    </div>
  );
}

function StatsSection({ data }) {
  const progress = (data.hoursDriven / data.hoursTotal) * 100;

  return (
    <div className="section-fade-in">
      <h2>Twoje postępy</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Wyjeżdżone godziny</h3>
          <div className="big-number">
            {data.hoursDriven} / {data.hoursTotal}
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        {/* <div className="stat-card">
          <h3>Egzamin wewnętrzny</h3>
          <div className="status-badge pending">Niezaliczony</div>
        </div> */}
        <div className="stat-card">
          <h3>Najbliższa jazda</h3>
          <p className="highlight-text">{data.nextRide}</p>
          <small>{data.instructor}</small>
        </div>
      </div>
    </div>
  );
}

function ScheduleSection() {
  const rides = [
    {
      id: 1,
      date: "17.02.2026",
      time: "14:00 - 16:00",
      instructor: "Marek Nowak",
      status: "upcoming",
    },
    {
      id: 2,
      date: "20.02.2026",
      time: "08:00 - 10:00",
      instructor: "Anna Wiśniewska",
      status: "upcoming",
    },
    {
      id: 3,
      date: "10.02.2026",
      time: "10:00 - 12:00",
      instructor: "Marek Nowak",
      status: "completed",
    },
  ];

  return (
    <div className="section-fade-in">
      <h2>Harmonogram jazd</h2>
      <div className="schedule-list">
        {rides.map((ride) => (
          <div key={ride.id} className={`ride-card ${ride.status}`}>
            <div className="ride-date">
              <span className="date-day">{ride.date.split(".")[0]}</span>
              <span className="date-month">LUT</span>
            </div>
            <div className="ride-info">
              <h4>{ride.time}</h4>
              <p>Instruktor: {ride.instructor}</p>
            </div>
            <div className="ride-status">
              {ride.status === "upcoming" ? (
                <span className="tag blue">Nadchodząca</span>
              ) : (
                <span className="tag gray">Zakończona</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({ data }) {
  return (
    <div className="section-fade-in">
      <h2>Twoje dane</h2>
      <form className="profile-form">
        <div className="form-group">
          <label>Imię i Nazwisko</label>
          <input type="text" value={data.name} disabled />
        </div>
        <div className="form-group">
          <label>Numer PKK</label>
          <input type="text" value={data.pkk} disabled />
        </div>
        <div className="form-group">
          <label>Adres e-mail</label>
          <input type="email" value="jan@example.com" disabled />
        </div>
        <div className="form-group">
          <label>Kategoria</label>
          <input type="text" value={data.category} disabled />
        </div>
      </form>
    </div>
  );
}
