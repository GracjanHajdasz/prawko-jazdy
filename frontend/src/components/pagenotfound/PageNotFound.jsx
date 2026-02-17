import "./PageNotFound.css";
import errorImage from "../../assets/error.png";

export default function PageNotFound() {
  return (
    <div className="pagenotfound-container">
      <img src={errorImage} alt="" />
      <h1>Error 404</h1>
      <p>Nie znaleziono strony.</p>
    </div>
  );
}
