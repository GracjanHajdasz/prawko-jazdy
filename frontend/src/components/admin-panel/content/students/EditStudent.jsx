import { useState } from "react";
import "./Students.css";
import axios from "axios";

export default function EditStudent({
  isFormVisable,
  setIsFormVisable,
  activeUser,
  setActiveUser,
  setRefreshTable,
  refreshTable,
}) {
  const [saveChanges, setSaveChanges] = useState(false);
  if (isFormVisable) {
    if (saveChanges === true) {
      axios.post("http://localhost:5000/api/students/editStudent", {
        clientid: activeUser.pkk,
        Rola: "USER",
        imie: activeUser.imie,
        nazwisko: activeUser.nazwisko,
        pesel: activeUser.pesel,
        newclientid: activeUser.pkk,
      });
      setIsFormVisable(false);
      setRefreshTable(!refreshTable);
    }

    return (
      <div className="edit-student-form">
        <p>imie</p>
        <input
          type="text"
          value={activeUser.imie}
          onChange={(e) =>
            setActiveUser({ ...activeUser, imie: e.target.value })
          }
        />
        <p>nazwisko</p>
        <input
          type="text"
          value={activeUser.nazwisko}
          onChange={(e) =>
            setActiveUser({ ...activeUser, nazwisko: e.target.value })
          }
        />
        <p>pesel</p>
        <input
          type="text"
          value={activeUser.pesel}
          onChange={(e) =>
            setActiveUser({ ...activeUser, pesel: e.target.value })
          }
        />
        <p>pkk</p>
        <input
          type="text"
          value={activeUser.pkk}
          onChange={(e) =>
            setActiveUser({ ...activeUser, pkk: e.target.value })
          }
        />
        <button
          onClick={() => {
            setIsFormVisable(false);
            setActiveUser(null);
          }}
        >
          wyjdz
        </button>
        <button
          onClick={() => {
            setSaveChanges(true);
          }}
        >
          zapisz
        </button>
      </div>
    );
  } else return null;
}
