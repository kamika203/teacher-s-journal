import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import classes from "../components/jou.module.css";

const Teachers = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("auth/teachers/");
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(
          `Failed to fetch protected data: ${error.response.status} ${error.response.statusText}`
        );
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className={classes.block2} style={{ color: "red" }}>
        {error}
      </div>
    );
  }

  if (!data) {
    return <div className={classes.block2}>Loading...</div>;
  }

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const data2 = data.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={classes.block2}>
      <h1>Преподаватели</h1>
      {pageNumbers.length>1?
      <div> Страницы
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className={number == currentPage ?  '' : classes.inactive }>
            {number}
          </button>
        ))}
      </div>:''}
      {/* {JSON.stringify(data)} */}
      {data2.map((user1) => (
          <div className={classes.mini}>
        
        <b>Фамилия:</b> {user1.last_name}
        <br />
        <b>Имя:</b> {user1.first_name}
        <br />
        <b>Отчество:</b> {user1.middle_name}
        <br />
        <b>Почта:</b> {user1.email}
        <br />
        {user1.phone ? "Телефон: " + user1.phone : ""}
      </div>
        ))}
    </div>
  );
};

export default Teachers;
