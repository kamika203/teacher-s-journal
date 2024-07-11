import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import classes from "../components/jou.module.css";
import AddButton from "../components/AddButton";
import { useNavigate } from "react-router-dom";

const Subs = ({ user }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("auth/subjects/");
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

  const handleDelete = async (id) => {
    let re = "auth/subjects/" + id;
    try {
      await axiosInstance.delete(re);
      setError(null);
      window.location.reload();
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
      {/* {JSON.stringify(data)} */}

      <h1>Предметы</h1>

      {pageNumbers.length > 1 ? (
        <div>
          {" "}
          Страницы
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={number == currentPage ? "" : classes.inactive}
            >
              {number}
            </button>
          ))}
        </div>
      ) : (
        ""
      )}
      {data2.map((sub) => (
        <div className={classes.mini}>
          <b>{sub.name}</b>
          <br />
          {user.role == "staff" ? (
            <button
              onClick={() => handleDelete(sub.id)}
              className={classes.end}
            >
              Удалить
            </button>
          ) : (
            ""
          )}
        </div>
      ))}
      <AddButton text="+" link="/add_sub" />
    </div>
  );
};

export default Subs;
