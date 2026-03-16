import { useEffect, useState } from "react";
import axios from "axios";
import "../../AdminPanel.css";
import EditStudent from "./EditStudent";
import AddStudent from "./AddStudent";

export default function Students() {
  const [users, setUsers] = useState([]);
  const [isEditFormVisable, setIsEditFormVisable] = useState(false);
  const [isAddFormVisable, setIsAddFormVisable] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/students/displayStudents", { od: 1 })
      .then((response) => {
        setUsers(
          response.data.students[0].map((user) => ({
            numerPKK: user.client_id,
            imie: user.imie,
            nazwisko: user.nazwisko,
            pesel: user.pesel,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, [refreshTable]);

  return (
    <>
      <EditStudent
        isFormVisable={isEditFormVisable}
        setIsFormVisable={setIsEditFormVisable}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        setRefreshTable={setRefreshTable}
        refreshTable={refreshTable}
      />
      <AddStudent
        isFormVisable={isAddFormVisable}
        setIsFormVisable={setIsAddFormVisable}
        setRefreshTable={setRefreshTable}
        refreshTable={refreshTable}
      />
      <table className="students-table">
        <thead>
          <tr>
            <th>Nazwisko</th>
            <th>Imię</th>
            <th>PESEL</th>
            <th>PKK</th>
            <th>akcja</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.numerPKK || index}>
              <td>{user.nazwisko}</td>
              <td>{user.imie}</td>
              <td>{user.pesel}</td>
              <td>{user.numerPKK}</td>
              <td>
                <button
                  onClick={() => {
                    setIsEditFormVisable(true);
                    setActiveUser({
                      imie: user.imie,
                      nazwisko: user.nazwisko,
                      pesel: user.pesel,
                      pkk: user.numerPKK,
                    });
                  }}
                  className="btn"
                >
                  edytuj
                </button>
                <button>usun</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn"
        onClick={() => {
          setIsAddFormVisable(true);
        }}
      >
        dodaj kursanta
      </button>
    </>
  );
}
