import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import {postUser} from '../utils/CRUD';
import {useNavigate, Link} from 'react-router-dom'
import "../styling/css/loginPage.css";
import '../styling/css/page.css';

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

            <header className="banner container">
                <div className="banner-content ">
                <h1>Great cooks</h1>
                <p>Use Chefify</p>
                </div>
            </header>

            <form className="loginForm" onSubmit={submitForm}>
                <h1>Register Account</h1>
                <label className="loginLabel" type="text" for="username">Username:</label>
                <input className="loginInput" type="text" name="username" placeholder='Enter Username'/>
                <label className="loginLabel" type="text" for="password">Password:</label>
                <input className="loginInput" type="password" name="password" placeholder='Enter Password'/>
                <input type="submit" />
                <h1>Haven an account? <Link to={`/login/`}>Login!</Link></h1>
            </form>
        </div>
    )
}

export default RegisterPage
