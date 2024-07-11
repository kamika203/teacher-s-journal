import React from "react";
import classes from "./jou.module.css";
import { useNavigate } from "react-router-dom";

const MiniSheet = ({ sheet }) => {
  let re = "/sheet/" + sheet.id;
  const navigate = useNavigate();
  return (
    <div className={classes.mini} onClick={() => navigate(re)}>
      <div>
        <b>{sheet.subject.name}</b>
      </div>
      <div>Группа: {sheet.group.name} </div>
      <div>{sheet.teacher ? "Преподаватель: " + sheet.teacher : ""}</div>
    </div>
  );
};

export default MiniSheet;
