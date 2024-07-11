import axios from 'axios';

export const getCsrfTokenFromServer = async () => {
    await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
};
