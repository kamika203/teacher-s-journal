import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import classes from '../components/jou.module.css'
import GroupMini from "../components/GroupMini";
import AddButton from "../components/AddButton";

const Groups = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("auth/groups/");
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
      <h1>Группы</h1>
      {/* {JSON.stringify(data)} */}
      {pageNumbers.length>1 ?
      <div> Страницы
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className={number == currentPage ?  '' : classes.inactive }>
            {number}
          </button>
        ))}
      </div>:''}
      {data2.map((group) => (
        <GroupMini group={group} />
      ))}
      <AddButton text='+' link='/add_gr' />
    </div>
  );
};

export default Groups;
