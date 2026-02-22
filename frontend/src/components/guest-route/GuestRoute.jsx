import { Navigate } from "react-router-dom";

export default function GuestRoute({ isLoggedIn, children }) {
  if (isLoggedIn) {
    return <Navigate to="/panel-uzytkownika" replace />;
  }
  return children;
}