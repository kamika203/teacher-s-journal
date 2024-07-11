import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import classes from '../components/jou.module.css';

const UpdateUser = () => {
    const user2 = JSON.parse(localStorage.getItem("user2"));
    const id = localStorage.getItem("id");
    const user1 = user2.find((j) => j.id == id);
    const [userData, setUserData] = useState(user1);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            let re='/auth/users/'+id+'/'
            await axiosInstance.put(re, userData);
            alert('User details updated successfully!');
            navigate('/main');
        } catch (error) {
            console.error('Failed to update user data:', error);
            if (error.response) {
                setError(`Update failed: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                setError('Update failed: No response from server.');
            } else {
                setError(`Update failed: ${error.message}`);
            }
        }
    };

    return (
        <div className={classes.block}>
            <form onSubmit={handleUpdate}>
                <h1>Update User </h1>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="text"
                    name="middle_name"
                    value={userData.middle_name}
                    onChange={handleChange}
                    placeholder="Middle Name"
                />
                <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                />
                <select name="role" value={userData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                </select>
                <input
                    type="text"
                    name="group"
                    value={userData.group}
                    onChange={handleChange}
                    placeholder="Group"
                />
                <button type="submit">Update</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default UpdateUser;
