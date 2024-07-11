import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import classes from "../components/jou.module.css";

const AddGroup = () => {
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [yoa, setYoa] = useState("");
  const [yoc, setYoc] = useState("");
  const [course, setCourse] = useState(1);
  const navigate = useNavigate();

  const handleGroupAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("auth/groups/", {
        name,
        year_of_admission: yoa,
        year_of_completion: yoc,
        course,
      });

      setError(null);
      navigate("/groups");
    } catch (error) {
      setError(
        `Failed to fetch protected data: ${error.response.status} ${error.response.statusText}`
      );
    }
  };

  const courses = [];
  for (let i = 1; i <= 6; i++) {
    courses.push(i);
  }

  return (
    <div className={classes.block}>
      <h1>Группу</h1>
      <form onSubmit={handleGroupAdd}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
          required
        />
        <input
          type="number"
          value={yoa}
          onChange={(e) => setYoa(e.target.value)}
          placeholder="Год поступления"
          required
        />
        <input
          type="number"
          value={yoc}
          onChange={(e) => setYoc(e.target.value)}
          placeholder="Год выпуска"
          required
        />
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          {courses.map((num) => (
            <option value={num}>{num}</option>
          ))}
        </select>

        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddGroup;
