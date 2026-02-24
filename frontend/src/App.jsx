import "./App.css";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/navbar/Navbar.jsx";
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";
import Scheduler from "./components/scheduler/Scheduler.jsx";
import MainPage from "./components/main-page/MainPage.jsx";
import Tests from "./components/tests/Tests.jsx";
import Exam from "./components/exam/Exam.jsx";
import Footer from "./components/footer/Footer.jsx";
import UserPanel from "./components/user-panel/UserPanel.jsx";
import PageNotFound from "./components/pagenotfound/PageNotFound.jsx";

const AppContext = createContext(null);

function AppLayout() {
  const { isLoggedIn, setIsLoggedIn, showPopUp, popUpText, setShowPopUp, triggerPopUp } = useContext(AppContext);

  return (
    <>
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <div className={`app ${!isLoggedIn ? "app-login" : ""}`}>
        <Outlet context={{ triggerPopUp, setIsLoggedIn }} />
        {showPopUp && (
          <PopUp
            popUpText={popUpText}
            duration={3000}
            show={showPopUp}
            setShowPopUp={setShowPopUp}
          />
        )}
      </div>
      {isLoggedIn && <Footer />}
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

function CatchAllRoute() {
  const { isLoggedIn } = useContext(AppContext);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <PageNotFound />;
}

function LoginWrapper() {
  const { setIsLoggedIn, triggerPopUp } = useContext(AppContext);
  return <Login setIsLoggedIn={setIsLoggedIn} triggerPopUp={triggerPopUp} />;
}

function RegisterWrapper() {
  const { triggerPopUp } = useContext(AppContext);
  return <Register triggerPopUp={triggerPopUp} />;
}

function SchedulerWrapper() {
  const { triggerPopUp } = useContext(AppContext);
  return <Scheduler triggerPopUp={triggerPopUp} />;
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/login", element: <PublicRoute><LoginWrapper /></PublicRoute> },
      { path: "/register", element: <PublicRoute><RegisterWrapper /></PublicRoute> },
      { path: "/", element: <ProtectedRoute><MainPage /></ProtectedRoute> },
      { path: "/harmonogram", element: <ProtectedRoute><SchedulerWrapper /></ProtectedRoute> },
      { path: "/testy", element: <ProtectedRoute><Tests /></ProtectedRoute> },
      { path: "/egzamin", element: <ProtectedRoute><Exam /></ProtectedRoute> },
      { path: "/panel-uzytkownika", element: <ProtectedRoute><UserPanel /></ProtectedRoute> },
      
      { path: "*", element: <CatchAllRoute /> }
    ]
  }
]);

export default function App() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const triggerPopUp = (text) => {
    setPopUpText(text);
    setShowPopUp(true);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/verify", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) return <div>Ładowanie...</div>;

  const contextValue = {
    isLoggedIn, setIsLoggedIn,
    showPopUp, setShowPopUp,
    popUpText, triggerPopUp
  };

  return (
    <AppContext.Provider value={contextValue}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}