import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import classes from "../components/jou.module.css";
import AddLab from "../components/AddLab";

function SheetDetail2({}) {
  const [data, setData] = useState(null);
  const [grades, setGrades] = useState({});
  const [attendancesState, setAttendancesState] = useState({});
  let { sheetId } = useParams();
  const user2 = JSON.parse(localStorage.getItem("user2"));
  const id = localStorage.getItem("id");
  const user1 = user2.find((j) => j.id == id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`auth/sheet/${sheetId}/`);
        setData(response.data);
        initializeStates(response.data);
      } catch (error) {
        console.error("Error fetching sheet details:", error);
      }
    };

    fetchData();
  }, [sheetId]);

  const initializeStates = (data) => {
    const initialGrades = {};
    const initialAttendances = {};

    data.journals.forEach((journal) => {
      initialGrades[`${journal.student}-${journal.lab}`] = journal.grade;
    });

    Object.keys(data.attendances).forEach((date) => {
      initialAttendances[date] = data.attendances[date];
    });

    setGrades(initialGrades);
    setAttendancesState(initialAttendances);
  };

  if (!data) return <div className={classes.block2}> Loading...</div>;

  const { sheet, students, labs, attendances, journals } = data;
  let teacherId=sheet.teacher_id;

  const attendanceDates = Object.keys(attendances).sort();

  const handleGradeChange = (studentId, labId, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [`${studentId}-${labId}`]: value,
    }));
  };

  const handleAttendanceChange = (date, studentId) => {
    setAttendancesState((prevAttendances) => {
      const newAttendances = { ...prevAttendances };
      if (newAttendances[date].includes(studentId)) {
        newAttendances[date] = newAttendances[date].filter(
          (id) => id !== studentId
        );
      } else {
        newAttendances[date].push(studentId);
      }
      return newAttendances;
    });
  };

  const saveData = async () => {
    try {
      const response = await axiosInstance.post(
        `auth/journal/bulk_create_update/`,
        Object.keys(grades).map((key) => {
          const [studentId, labId] = key.split("-");
          return {
            id: journals.find((j) => j.student === parseInt(studentId) && j.lab === parseInt(labId))?.id,
            lab_id: parseInt(labId),
            student_id: parseInt(studentId),
            grade: grades[key],
          };
        })
      );
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data.");
    }
  };
  

  return (
    <div className={classes.block2}>
      <h1>
        {sheet.subject.name} - {sheet.group.name}
      </h1>
      <table border="1" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Студенты</th>
            {labs.map((lab) => (
              <th key={lab.id}>{lab.name}</th>
            ))}
            <th></th>
            {attendanceDates.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              {labs.map((lab) => {
                const key = `${student.id}-${lab.id}`;
                return (
                  <td className={classes.tdc} key={lab.id}>
                    <input
                    className={classes.small}
                      type="text"
                      value={grades[key] || ""}
                      onChange={(e) =>
                        handleGradeChange(student.id, lab.id, e.target.value)
                      }
                    />
                  </td>
                );
              })}
              <td>__</td>
              {attendanceDates.map((date) => (
                <td className={classes.tdc} key={date}>
                  <input
                    type="checkbox"
                    checked={attendancesState[date].includes(student.id)}
                    onChange={() => handleAttendanceChange(date, student.id)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveData}>Сохранить</button>
      {user1.role != "student" ? <AddLab sheetId={sheetId} teacherId={teacherId} /> : ""}
    </div>
  );
}

export default SheetDetail2;
