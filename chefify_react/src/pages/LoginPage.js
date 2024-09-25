import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {Link} from "react-router-dom";
import "../styling/css/loginPage.css";
import '../styling/css/page.css';

const LoginPage = () => {

  let { loginUser } = useContext(AuthContext)

  return (
    <div>

      <header className="banner container">
        <div className="banner-content ">
          <h1>Great cooks</h1>
          <p>Use Chefify</p>
        </div>
      </header>

      

      <form onSubmit={loginUser} className="loginForm">
          <h1>Register Account</h1>
          <label className="loginLabel" type="text" for="username">Username:</label>
          <input className="loginInput" type="text" name="username" placeholder='Enter Username'/>
          <label className="loginLabel" type="text" for="password">Password:</label>
          <input className="loginInput" type="password" name="password" placeholder='Enter Password'/>
          <input type="submit" />
      </form>

      <h1>Don't have an account? <Link to={`/register/`}>Create one!</Link></h1>
    </div>
  )
}

export default LoginPage
