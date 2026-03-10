import { useEffect, useState } from "react";
import "../AdminPanel.css";

export default function Instructors() {
  const mockInstructors = [
    {
      id: "INS/2024/001",
      pesel: "75051234567",
      imie: "Marek",
      nazwisko: "Adamski",
      nrLicencji: "LIC/001/2024",
      telefon: "601 234 567",
      email: "m.adamski@szkola.pl",
    },
    {
      id: "INS/2024/002",
      pesel: "68092345678",
      imie: "Katarzyna",
      nazwisko: "Brzezińska",
      nrLicencji: "LIC/002/2024",
      telefon: "602 345 678",
      email: "k.brzezinska@szkola.pl",
    },
    {
      id: "INS/2023/003",
      pesel: "80123456789",
      imie: "Robert",
      nazwisko: "Czajkowski",
      nrLicencji: "LIC/003/2023",
      telefon: "603 456 789",
      email: "r.czajkowski@szkola.pl",
    },
    {
      id: "INS/2023/004",
      pesel: "72074567890",
      imie: "Joanna",
      nazwisko: "Dąbrowska",
      nrLicencji: "LIC/004/2023",
      telefon: "604 567 890",
      email: "j.dabrowska@szkola.pl",
    },
    {
      id: "INS/2024/005",
      pesel: "88035678901",
      imie: "Krzysztof",
      nazwisko: "Ewald",
      nrLicencji: "LIC/005/2024",
      telefon: "605 678 901",
      email: "k.ewald@szkola.pl",
    },
  ];

  const fetchInstructors = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInstructors);
      }, 1500);
    });
  };

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchInstructors().then((data) => {
      setInstructors(data);
    });
  }, []);

  return (
    <table className="instructors-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nazwisko</th>
          <th>Imię</th>
          <th>PESEL</th>
          <th>nrLicencji</th>
          <th>Telefon</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {instructors.map((instructor) => (
          <tr key={instructor.id}>
            <td>{instructor.id}</td>
            <td>{instructor.nazwisko}</td>
            <td>{instructor.imie}</td>
            <td>{instructor.pesel}</td>
            <td>{instructor.nrLicencji}</td>
            <td>{instructor.telefon}</td>
            <td>{instructor.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
