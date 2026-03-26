import { useState } from "react";
import axios from "axios";
import "../../AdminPanel.css";

export default function Invoices() {
  const [clientId, setClientId] = useState("");
  const [liczbaGodzin, setLiczbaGodzin] = useState("");
  const [kwota, setKwota] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  function handleInvoice() {
    axios
      .post("http://localhost:5000/api/students/newInvoice", {
        clientid: clientId,
        liczba_godzin: liczbaGodzin,
        kwota_za_h: kwota,
      })
      .then((response) => {
        console.log(response);
        if (showAlert === true) setShowAlert(false);
      })
      .catch((error) => {
        console.log("wystapił błąd: " + error);
        if (error.status === 400) setShowAlert(true);
      });
  }

  return (
    <div className="invoices">
      <p>numer pkk</p>
      <input type="text" onChange={(e) => setClientId(e.target.value)} />
      <p>liczba godzin</p>
      <input
        type="text"
        onChange={(e) => setLiczbaGodzin(Number(e.target.value))}
      />
      <p>kwota za 1 godzine</p>
      <input type="text" onChange={(e) => setKwota(Number(e.target.value))} />
      <button className="btn" onClick={handleInvoice}>
        Wystaw fakturę
      </button>
      {showAlert && <p>Wystąpił błąd, sprawdź poprawność danych</p>}
    </div>
  );
}
