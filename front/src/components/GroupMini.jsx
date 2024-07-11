import React from "react";
import classes from "./jou.module.css";
import { useNavigate } from "react-router-dom";

const GroupMini = ({ group }) => {
  let re = "/group/" + group.id;
  const navigate = useNavigate();
  return (
    <div className={classes.mini} onClick={() => navigate(re)}>
      <div><b>Группа: {group.name} </b></div>
      <div>Курс: {group.course}</div>
      <div>{group.year_of_admission} - {group.year_of_completion}</div>
    </div>
  );
};

export default GroupMini;
