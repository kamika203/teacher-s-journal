import Cookies from 'js-cookie';

export function getCsrfToken() {
    return Cookies.get('csrftoken');
}
