import React, { useContext } from 'react'
import '../styling/css/navbar.css'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <nav>
        <ul>
            <Link id="logo" to='/'>Chefify</Link>
            
            <form className="searchbar" method="GET" action="">
                <input type="text" name="q" placeholder="Search Recipe..."/>
            </form>

            <Link to='/'>Home</Link>

            {user ? (
              <Link to='/' onClick={logoutUser}>Logout</Link>
            ):(
              <Link to='/login/'>Login</Link>
            )}

            {user && <p>Hello {user.username}</p>}

            {/* <li className="hideOnMobile"><a href="{% url 'logout' %}">Logout</a></li>

            <li className="hideOnMobile"><a href="{% url 'login-page' %}">Login</a></li>

            <li className="menu"><a><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li> */}
        </ul>
    </nav>
  )
}

export default Header
