import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import classes from "../components/jou.module.css";

const AddSub = () => {
  const [name, setName] = useState("");
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("auth/subjects/", {
        name,
        
      });
      setError(null);
      // alert("subject added successfully!");
      navigate("/subjects");
    } catch (error) {
      if (error.response) {
        setError(
          `Subject add failed: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("Subject add failed: No response from server.");
      } else {
        setError(`Subject add failed: ${error.message}`);
      }
    }
  };

  return (
    <div className={classes.block}>
      <h1>Предмет</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
          required
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddSub;
