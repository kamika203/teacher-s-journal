import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import classes from "./jou.module.css";

const NavBar = ({ loged, set }) => {
  const user = JSON.parse(localStorage.getItem("user2"));

  if (loged != "anon") {
    return (
      <div className={classes.nav}>
        <Link to="/profile">{loged}</Link>
        <Link to="/main">Листы</Link>
        <Link to="/groups">Группы</Link>
        <Link to="/subjects">Предметы</Link>
        <Link to="/teachers">Преподаватели</Link>


        {/* {user[0].role !== "student" ? " Teacher" : " Student"} */}
        {/* {JSON.stringify(user)+user[0].role} */}

        {<Logout set={set} />}
      </div>
    );
  }
  return (
    <div className={classes.nav}>
      {loged}
      <Link to="/login">Log in </Link>
    </div>
  );
};

export default NavBar;

// // SomeComponent.js
// import React, { useContext } from 'react';
// import { UserContext } from '../contexts/UserContext';

// const SomeComponent = () => {
//     const { user } = useContext(UserContext);

//     if (!user) return <div>Loading...</div>;

//     return (
//         <div>
//             {user.role === 'teacher' ? (
//                 <TeacherComponent />
//             ) : (
//                 <StudentComponent />
//             )}
//         </div>
//     );
// };

// export default SomeComponent;
