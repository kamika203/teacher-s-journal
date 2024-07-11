import React from 'react'
import classes from "./jou.module.css";

const AboutUser = ({user1}) => {
  return (
    <div>
        <h1>Данные о пользователе</h1>
    <div className={classes.mini}>
      <b>Username:</b> {user1.username}
      <br />
      <b>Фамилия:</b> {user1.last_name}
      <br />
      <b>Имя:</b> {user1.first_name}
      <br />
      <b>Отчество:</b> {user1.middle_name}
      <br />
      <b>Почта:</b> {user1.email}
      <br />
      {user1.phone ? "<b>Телефон:</b>" + user1.phone : ""}
      <b>Роль:</b>{" "}
      {user1.role == "student" ? "student " + user1.group : user1.role}
    </div></div>
  )
}

export default AboutUser