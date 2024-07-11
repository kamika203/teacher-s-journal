import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import classes from './jou.module.css'
import { useNavigate } from "react-router-dom";

const AddLab = ({sheetId}) => {
    const [name, setName] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAddLab = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/labs/', {
                sheet: sheetId,
                name,
                max_score: maxScore,
            });
            alert('Lab added successfully!');
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setError(`Failed to add lab: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                setError('Failed to add lab: No response from server.');
            } else {
                setError(`Failed to add lab: ${error.message}`);
            }
        }
    };

  return (
    <form onSubmit={handleAddLab}>
            <h2>Добавить лабораторную</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="название"
                required
            />
            <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="максимальный балл"
                required
            />
            <button type="submit">Добавить</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
  )
}

export default AddLab