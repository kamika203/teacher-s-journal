import React from 'react'
import { useNavigate } from "react-router-dom";
import classes from '../components/jou.module.css'

const AddButton = ({text, link}) => {
    const navigate = useNavigate();
  return (
    <button className={classes.add} onClick={()=>navigate(link)}>{text}</button>
  )
}

export default AddButton