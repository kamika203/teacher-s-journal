import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axiosInstance from '../axiosInstance';
import classes from '../components/jou.module.css'
import AddButton from '../components/AddButton';

const GroupDetail = () => {
    const [data, setData] = useState(null);
    let { groupId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`auth/group/students/${groupId}/`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching sheet details:", error);
            }
        };

        fetchData();
    }, [groupId]);

    if (!data) return <div  className={classes.block2}> Loading...</div>;

    const { group, students } = data;

    return (
        <div className={classes.block2}>
            <h1> {group.name}</h1>
            <table border="1" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ФИО</th>
                        <th>Почта</th>
                        <th>Телефон</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student,index) => (
                        <tr key={student.id}>
                            <td>{index+1}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddButton text='+' link='/register' />
        </div>
    );
}


export default GroupDetail