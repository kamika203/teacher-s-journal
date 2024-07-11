import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import classes from '../components/jou.module.css'

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [group, setGroup] = useState("");
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([{id:"---",name:'---'}]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get("auth/groups/");
        setGroups([{id:"---",name:'---'}, ...response.data]);
        setError(null);
      } catch (error) {
        setError(
          `Failed to fetch protected data: ${error.response.status} ${error.response.statusText}`
        );
      }
    };

    fetchGroups();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("auth/userss/", {
        username,
        email,
        password,
        re_password: password2,
        first_name: firstName,
        last_name: lastName,
        middle_name: "",
        phone,
        role,
        group: group != "---" ? group : null, // Send group as null if empty
      });
      setError(null);
      alert("User registered successfully!");
    } catch (error) {
      if (error.response) {
        setError(
          `Registration failed: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("Registration failed: No response from server.");
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    }
  };

  return (
    <div className={classes.block}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="staff">Staff</option>
        </select>
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          {groups.map((gr) => (
            <option value={gr.id}>{gr.name}</option>
          ))}
        </select>

        {/* <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group" /> */}
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate("/login")}>to Login page</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Register;
