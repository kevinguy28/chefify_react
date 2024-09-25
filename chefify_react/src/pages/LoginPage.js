import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import {Link, useNavigate} from "react-router-dom";
import {postUser} from '../utils/CRUD';
import "../styling/css/loginPage.css";
import '../styling/css/page.css';

const LoginPage = () => {

  let { loginUser, getCsrfToken } = useContext(AuthContext)
  const navigate = useNavigate();

  let [loginState, setLoginState] = useState(true);

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

  const changeState = async (e) => {
    console.log(e.target.getAttribute("name"));
    if(loginState === true && e.target.getAttribute("name") === "register"){
      setLoginState(false);
    }else if(loginState === false && e.target.getAttribute("name") === "login"){
      setLoginState(true);
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

      <div className="credentialsCard cardAlignment">
        <div className={`loginCard ${loginState ? "" : "registerCardOff tmp"}`}> 
          <h1 className={`registerHeader ${loginState ? "" : "tmp2"}`}>Sign in</h1><br/>
          <form className={`${loginState ? "" : "hide"}`} onSubmit={loginUser}>
              <div className="credentialForm">
                <label className="loginLabel" type="text" for="username">Username:</label>
                <input className="loginInput" type="text" name="username" placeholder='Enter Username'/>
                <label className="loginLabel" type="text" for="password">Password:</label>
                <input className="loginInput" type="password" name="password" placeholder='Enter Password'/>
              </div>
              <input className="submitCredentials" type="submit" value="Login"/>
          </form>
          <h2 className={`${loginState ? "hide" : "tmp2"}`}>Don't have an account?</h2>
          <span className={` submitCredential2 ${loginState ? "hide" : "tmp2"}`} name="login" onClick={changeState}>Login!</span>
        </div>
        <div className={`registerCard ${loginState ? "registerCardOff tmp" : ""}`} >
          <h1 className={`registerHeader ${loginState ? "tmp2" : ""}`}>Register Account</h1><br/>
          <form className={`${loginState ? "hide" : ""}`} onSubmit={submitForm}>
            <div className="credentialForm">
              <label className="loginLabel" type="text" for="username">Username:</label>
              <input className="loginInput" type="text" name="username" placeholder='Enter Username'/>
              <label className="loginLabel" type="text" for="password">Password:</label>
              <input className="loginInput" type="password" name="password" placeholder='Enter Password'/>
            </div>
            <input className="submitCredentials" type="submit" value="Register" />
          </form>
          <h2 className={`${loginState ? "tmp2" : "hide"}`}>Have an account?</h2>
          <span className={`submitCredential2 ${loginState ? "tmp2" : "hide"}`} name="register" onClick={changeState}>Register!</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
