import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function BulkCreateUpdateJournal({ sheetId, s,l,j}) {
    const [journalData, setJournalData] = useState(j);
    const [students, setStudents] = useState(s);
    const [labs, setLabs] = useState(l);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     // Fetch journal data for the given sheet


    //     const fetchJournalData = async () => {
    //         try {
    //             const journalResponse = await axiosInstance.get(`/auth/journal/?sheet=${sheetId}`);
    //             setJournalData(journalResponse.data);

    //             const studentsResponse = await axiosInstance.get(`/auth/students/?group=${sheetId}`);
    //             setStudents(studentsResponse.data);

    //             const labsResponse = await axiosInstance.get(`/auth/labs/?sheet=${sheetId}`);
    //             setLabs(labsResponse.data);
    //         } catch (error) {
    //             setError('Failed to fetch data.');
    //         }
    //     };

    //     fetchJournalData();
    // }, [sheetId]);

    const handleChange = (e, id, isNew = false) => {
        const { name, value } = e.target;
        if (isNew) {
            setJournalData(prevState => prevState.map(entry =>
                entry.id === id ? { ...entry, [name]: value } : entry
            ));
        } else {
            setJournalData(prevState =>
                prevState.map(entry =>
                    entry.id === id ? { ...entry, [name]: value } : entry
                )
            );
        }
    };

    const handleBulkUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/journal/bulk_create_update/', journalData);
            alert('Journal updated successfully!');
        } catch (error) {
            if (error.response) {
                setError(`Update failed: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                setError('Update failed: No response from server.');
            } else {
                setError(`Update failed: ${error.message}`);
            }
        }
    };

    const addNewEntry = () => {
        const newEntry = {
            id: `new-${journalData.length}`,
            student_id: students.length > 0 ? students[0].id : '',
            lab_id: labs.length > 0 ? labs[0].id : '',
            grade: '',
            isNew: true
        };
        setJournalData([...journalData, newEntry]);
    };

    return (
        <form onSubmit={handleBulkUpdate}>
            <h2>Update Journal</h2>
            <button type="button" onClick={addNewEntry}>Add New Entry</button>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Lab</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {journalData.map((entry, index) => (
                        <tr key={entry.id}>
                            <td>{index + 1}</td>
                            <td>
                                <select
                                    name="student_id"
                                    value={entry.student_id}
                                    onChange={(e) => handleChange(e, entry.id, entry.isNew)}
                                    disabled={!entry.isNew}
                                >
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.first_name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    name="lab_id"
                                    value={entry.lab_id}
                                    onChange={(e) => handleChange(e, entry.id, entry.isNew)}
                                    disabled={!entry.isNew}
                                >
                                    {labs.map(lab => (
                                        <option key={lab.id} value={lab.id}>
                                            {lab.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="grade"
                                    value={entry.grade}
                                    onChange={(e) => handleChange(e, entry.id, entry.isNew)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button type="submit">Update Journal</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
}

export default BulkCreateUpdateJournal;
