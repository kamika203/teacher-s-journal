import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import classes from "../components/jou.module.css";
import AddLab from "../components/AddLab";
import BulkCreateUpdateJournal from "../components/BulkCreateUpdateJournal";

function SheetDetail({}) {
  const [data, setData] = useState(null);
  let { sheetId } = useParams();
  const user2 = JSON.parse(localStorage.getItem("user2"));
  const id = localStorage.getItem("id");
  const user1 = user2.find((j) => j.id == id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`auth/sheet/${sheetId}/`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching sheet details:", error);
      }
    };

    fetchData();
  }, [sheetId]);

  if (!data) return <div className={classes.block2}> Loading...</div>;

  const { sheet, students, labs, attendances, journals } = data;

  const attendanceDates = Object.keys(attendances).sort();

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
                const journal = journals.find(
                  (j) => j.student === student.id && j.lab === lab.id
                );
                return (
                  <td className={classes.tdc} key={lab.id}>
                    {journal ? journal.grade : "N/A"}
                  </td>
                );
              })}
              <td>__</td>
              {attendanceDates.map((date) => (
                <td className={classes.tdc} key={date}>
                  {attendances[date].includes(student.id) ? "+" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {user1.role != "student" ? <AddLab sheetId={sheetId} /> : ""}
    </div>
  );
}

export default SheetDetail;
