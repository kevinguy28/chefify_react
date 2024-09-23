import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import {Link} from "react-router-dom"

const LoginPage = () => {

  let { loginUser } = useContext(AuthContext)

  return (
    <div>
        <form onSubmit={loginUser}>
            <input type="text" name="username" placeholder='Enter Username'/>
            <input type="password" name="password" placeholder='Enter Password'/>
            <input type="submit" />
        </form>

        <h1>Don't have an account? <Link to={`/register/`}>Create one!</Link></h1>

    </div>
  )
}

export default LoginPage
