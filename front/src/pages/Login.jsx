import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import classes from '../components/jou.module.css'

function Login({set}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('auth/token/login/', {
                username,
                password,
            });
            localStorage.setItem('authToken', response.data.auth_token);
            setError(null);

            const userResponse = await axiosInstance.get('/auth/userss/', {
                headers: {
                    Authorization: `Token ${response.data.auth_token}`
                }
            });
            const userData = userResponse.data;
            localStorage.setItem('user2', JSON.stringify(userData));

            const userIdResponse = await axiosInstance.get('/auth/userss/me/', {
                headers: {
                    Authorization: `Token ${response.data.auth_token}`
                }
            });
            const userIdData = userIdResponse.data;
            localStorage.setItem('id', userIdData.id);

            navigate('/main');
            set(username);
            localStorage.setItem('user', username);

        } catch (error) {
            if (error.response) {
                // Request made and server responded with a status code
                // that falls out of the range of 2xx
                setError(`Login failed: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                // The request was made but no response was received
                setError('Login failed: No response from server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(`Login failed: ${error.message}`);
            }
        }
    };

    return (
        <div className={classes.block}>
            
            <form onSubmit={handleLogin}>
            <h1>Login</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={()=>navigate('/register')}>Register</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

export default Login;
