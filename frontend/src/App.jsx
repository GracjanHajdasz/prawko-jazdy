import "./App.css";
import { useState, useEffect, useMemo } from "react";
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

  const router = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: (
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
      ),
      children: !isLoggedIn ? [
        { path: "login", element: <Login setIsLoggedIn={setIsLoggedIn} triggerPopUp={triggerPopUp} /> },
        { path: "register", element: <Register triggerPopUp={triggerPopUp} /> },
        { path: "*", element: <Navigate to="/login" replace /> }
      ] : [
        { index: true, element: <MainPage /> },
        { path: "harmonogram", element: <Scheduler triggerPopUp={triggerPopUp} /> },
        { path: "testy", element: <Tests /> },
        { path: "egzamin", element: <Exam /> },
        { path: "panel-uzytkownika", element: <UserPanel /> },
        { path: "login", element: <Navigate to="/" replace /> },
        { path: "register", element: <Navigate to="/" replace /> },
        { path: "*", element: <PageNotFound /> }
      ]
    }
  ]), [isLoggedIn, showPopUp, popUpText]);

  if (loading) return <div>Ładowanie...</div>;

  return <RouterProvider router={router} />;
}