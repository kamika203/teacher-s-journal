import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "../components/jou.module.css";
import AddButton from "../components/AddButton";
import AboutUser from "../components/AboutUser";

const Profille = () => {
  const user2 = JSON.parse(localStorage.getItem("user2"));
  const id = localStorage.getItem("id");
  const navigate = useNavigate();
  const user1 = user2.find((j) => j.id == id);

  return (
    <div className={classes.block2}>
      
      {/* {JSON.stringify(user2)} */}
      <AboutUser user1={user1} />
      <AddButton text='✒' link='/update_user' />
    </div>
  );
};

export default Profille;
