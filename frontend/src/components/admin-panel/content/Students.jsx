import { useEffect, useState } from "react";
import "../AdminPanel.css";

export default function Students() {
  const mockUsers = [
    {
      numerPKK: "PKK/2024/001234",
      pesel: "90010112345",
      imie: "Jan",
      nazwisko: "Kowalski",
    },
    {
      numerPKK: "PKK/2024/005678",
      pesel: "85032567890",
      imie: "Anna",
      nazwisko: "Nowak",
    },
    {
      numerPKK: "PKK/2023/009012",
      pesel: "78110334521",
      imie: "Piotr",
      nazwisko: "Wiśniewski",
    },
    {
      numerPKK: "PKK/2024/003456",
      pesel: "95062298765",
      imie: "Maria",
      nazwisko: "Wójcik",
    },
    {
      numerPKK: "PKK/2023/007890",
      pesel: "82041456234",
      imie: "Tomasz",
      nazwisko: "Zieliński",
    },
  ];

  const fetchUsers = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 1500);
    });
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <table className="students-table">
      <thead>
        <tr>
          <th>Nazwisko</th>
          <th>Imię</th>
          <th>PESEL</th>
          <th>PKK</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.pesel}>
            <td>{user.nazwisko}</td>
            <td>{user.imie}</td>
            <td>{user.pesel}</td>
            <td>{user.numerPKK}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
