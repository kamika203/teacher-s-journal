import React from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

function LogoutButton({set}) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('auth/token/logout/'); // Отправляем запрос на выход
            localStorage.removeItem('authToken'); // Удаляем токен из локального хранилища
            set('anon');
            localStorage.setItem('user','anon');
            navigate('/login'); // Перенаправляем на страницу входа
        } catch (error) {
            console.error('Logout failed:', error);
            // Можно добавить обработку ошибок, если выход не удался
        }
    };

    return (
        <button onClick={handleLogout}>Выйти</button>
    );
}

export default LogoutButton;
