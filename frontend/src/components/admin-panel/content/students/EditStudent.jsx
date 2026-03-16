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
        <input type="text" value={activeUser.imie} />
        <p>nazwisko</p>
        <input type="text" value={activeUser.nazwisko} />
        <p>pesel</p>
        <input type="text" value={activeUser.pesel} />
        <p>pkk</p>
        <input type="text" value={activeUser.pkk} />
        <button
          onClick={() => {
            setIsFormVisable(false);
            setActiveUser(null);
          }}
        >
          wyjdz
        </button>
      </div>
    );
  else return null;
}
