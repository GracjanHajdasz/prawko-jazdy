import { useEffect, useState } from "react";
import "./Students.css";
import axios from "axios";

export default function StudentsLessons({
  isLessonsVisable,
  setIsLessonsVisable,
  activeUser,
}) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (!isLessonsVisable || !activeUser?.pkk) return;

    axios
      .post("http://localhost:5000/api/students/getStudentsLessons", {
        clientid: activeUser.pkk,
      })
      .then((response) => {
        console.log(response.data);
        setLessons(response.data.Lessons);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, [isLessonsVisable, activeUser]);

  if (!isLessonsVisable || !activeUser?.pkk) return null;
  return (
    <div className="edit-student-form">
      <h1>lekcje kursanta</h1>
      <div className="lessons">
        {lessons.length === 0 && <p>Brak lekcji</p>}
        {lessons.map((lesson) => (
          <p key={lesson.data}>{lesson.data}</p>
        ))}
      </div>
      <button
        onClick={() => {
          setIsLessonsVisable(false);
          setLessons([]);
        }}
      >
        wyjdz
      </button>
    </div>
  );
}
