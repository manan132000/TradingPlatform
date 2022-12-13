import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
// const ROOT_URL = "http://127.0.0.1:5000"

function Logout(props) {
    const [cookies, setCookie,removeCookie] = useCookies(['user'])
    let navigate = useNavigate();

    useEffect(()=>{
        removeCookie('DematId', { path: '/' });
        props.fxn(false);
        navigate('/');
    })
}

export default Logout