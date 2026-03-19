import "./Students.css";
import axios from "axios";
import { useState } from "react";

export default function AddStudent({
  isFormVisable,
  setIsFormVisable,
  setRefreshTable,
  refreshTable,
}) {
  const emptyUser = {
    imie: "",
    nazwisko: "",
    pesel: "",
    pkk: "",
    mail: "",
  };
  const [newUser, setNewUser] = useState(emptyUser);

  if (!isFormVisable) return null;

  const handleSave = () => {
    // Client-side validation to avoid sending incomplete data
    const missingFields = [];
    if (!newUser.imie) missingFields.push("imie");
    if (!newUser.nazwisko) missingFields.push("nazwisko");
    if (!newUser.pesel) missingFields.push("pesel");
    if (!newUser.pkk) missingFields.push("pkk");
    if (missingFields.length > 0) {
      alert(`Uzupełnij pola: ${missingFields.join(", ")}`);
      return;
    }

    axios
      .post("http://localhost:5000/api/students/addNewStudent", {
        pkk: newUser.pkk,
        pesel: newUser.pesel,
        imie: newUser.imie,
        nazwisko: newUser.nazwisko,
        rola: "USER",
        mail: newUser.mail,
      })
      .then(() => {
        setIsFormVisable(false);
        setRefreshTable(!refreshTable);
      })
      .catch((error) => {
        console.error("Błąd podczas zapisywania:", error);
        console.error("Status:", error.response?.status);
        console.error("Dane błędu:", error.response?.data);
        alert(
          `Błąd serwera: ${error.response?.status}\n${JSON.stringify(error.response?.data)}`,
        );
      });
  };

  return (
    <div className="edit-student-form">
      <h1>dodaj kursanta</h1>
      <p>imie</p>
      <input
        type="text"
        value={newUser.imie}
        onChange={(e) => setNewUser({ ...newUser, imie: e.target.value })}
      />
      <p>nazwisko</p>
      <input
        type="text"
        value={newUser.nazwisko}
        onChange={(e) => setNewUser({ ...newUser, nazwisko: e.target.value })}
      />
      <p>pesel</p>
      <input
        type="text"
        value={newUser.pesel}
        onChange={(e) => setNewUser({ ...newUser, pesel: e.target.value })}
      />
      <p>pkk</p>
      <input
        type="text"
        value={newUser.pkk}
        onChange={(e) => setNewUser({ ...newUser, pkk: e.target.value })}
      />
      <p>mail</p>
      <input
        type="text"
        value={newUser.mail}
        onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
      />
      <button
        onClick={() => {
          setIsFormVisable(false);
          setNewUser(emptyUser);
        }}
      >
        wyjdz
      </button>
      <button onClick={handleSave}>zapisz</button>
    </div>
  );
}
