import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState( () => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate();


    let getCsrfToken = async () => {
        let response = await fetch('/api/csrf/', {
            credentials: 'include',
        });
        let data = await response.json();
        return(data.csrfToken);
    };

    // Authentication Functions

    let loginUser = async (e) => {
        e.preventDefault()
        console.log(e.target.username.value)
        let response = await fetch('api/token/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username': e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        }else{
            alert("The password or username is incorrect.")
        }
    }

    let logoutUser = () =>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/')
    }

    let updateToken = async () =>{

        let response = await fetch('api/token/refresh/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            console.log("badd error happened")
            logoutUser();
        }

        setLoading(false);
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        getCsrfToken: getCsrfToken,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(()=>{
        if(loading){
            updateToken()
        }

        let time = 1000*60*5;
        let interval = setInterval(() => {
            if(authTokens){
                updateToken()
            }
        }, time)
        return ()=> clearInterval(interval)

    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}