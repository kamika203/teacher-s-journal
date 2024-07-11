import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import classes from "../components/jou.module.css";

const AddSheet = ({ g, s, t }) => {
  const [gr, setGroup] = useState(g);
  const [sub, setSubject] = useState(s);
  const [tea, setTeacher] = useState(t);

  const [teachers, setTeachers] = useState([
    { id: "---", last_name: "---", first_name: "---" },
  ]);
  const [groups, setGroups] = useState([{ id: "---", name: "---" }]);
  const [subs, setSubjects] = useState([{ id: "---", name: "---" }]);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get("auth/groups/");
        setGroups([{ id: "---", name: "---" }, ...response.data]);
        setError(null);
      } catch (error) {
        setError(
          `Failed to fetch groups: ${error.response.status} ${error.response.statusText}`
        );
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get("auth/teachers/");
        setTeachers([{ id: "---", last_name: "---", first_name: "---" }, ...response.data]);
        setError(null);
      } catch (error) {
        setError(
          `Failed to fetch teachers: ${error.response.status} ${error.response.statusText}`
        );
      }
    };

    const fetchSubs = async () => {
      try {
        const response = await axiosInstance.get("auth/subjects/");
        setSubjects([{ id: "---", name: "---"  }, ...response.data]);
        setError(null);
      } catch (error) {
        setError(
          `Failed to fetch subjects: ${error.response.status} ${error.response.statusText}`
        );
      }
    };

    fetchGroups();
    fetchTeachers();
    fetchSubs();
  }, []);

  const handleSheet = async (e) => {
    e.preventDefault();
    
    // Log the data being sent
    console.log({
      teacher: tea,
      subject: sub,
      group: gr
    });

    try {
      if (gr !== '---' && tea !== '---' && sub !== '---') {
        const response = await axiosInstance.post("auth/sheets2/", {
          teacher: tea,
          subject: sub,
          group: gr,
        });
        setError(null);
        // alert("Sheet added successfully!");
        navigate("/main");
      } else {
        setError("Please select valid teacher, subject, and group.");
      }
    } catch (error) {
      if (error.response) {
        setError(
          `Sheet add failed: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("Sheet add failed: No response from server.");
      } else {
        setError(`Sheet add failed: ${error.message}`);
      }
    }
  };

  return (
    <div className={classes.block}>
      <h1>Лист</h1>
      <form onSubmit={handleSheet}>
        <select value={sub} onChange={(e) => setSubject(e.target.value)}>
          {subs.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={tea} onChange={(e) => setTeacher(e.target.value)}>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.last_name + ' ' + t.first_name}</option>
          ))}
        </select>
        <select value={gr} onChange={(e) => setGroup(e.target.value)}>
          {groups.map((gr) => (
            <option key={gr.id} value={gr.id}>{gr.name}</option>
          ))}
        </select>
        <button type="submit">Добавить</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default AddSheet;
