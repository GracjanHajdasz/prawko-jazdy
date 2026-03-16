import "./Students.css";

export default function EditStudent({
  isFormVisable,
  setIsFormVisable,
  activeUser,
  setActiveUser,
}) {
  if (isFormVisable)
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
        <button>zapisz</button>
      </div>
    );
  else return null;
}
