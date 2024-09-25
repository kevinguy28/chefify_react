import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import {postUser} from '../utils/CRUD';
import {useNavigate} from 'react-router-dom'

const RegisterPage = () => {

    let {getCsrfToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        let csrfToken = getCsrfToken();
        const response = await postUser(csrfToken, e);
        if(response.ok){
            navigate("/");
        }else{
            const errorMessage = await response.json()
            alert(errorMessage?.message)
            console.log(errorMessage?.message)
        }
    };

    return (
        <div>
            <form onSubmit={submitForm}>
                <input type="text" name="username" placeholder='Enter Username'/>
                <input type="password" name="password" placeholder='Enter Password'/>
                <input type="submit" />
            </form>
            poop
        </div>
    )
}

export default RegisterPage
