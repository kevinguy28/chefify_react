import React, {useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthContext";
import { useNavigate} from 'react-router-dom';


const RecipeForms = () => {

    const navigate = useNavigate();

    let {authTokens, user, getCsrfToken} = useContext(AuthContext)

    let [formData, setFormData] = useState({
        "name": "",
        "category": "N/A",
        "privacy": "private",
        "user_id": user.user_id,
    })
    let [categories, setCategories] = useState([]);

    const submitForm = async (e) => {
        e.preventDefault();
        let csrfToken = getCsrfToken();
        let response = await fetch('/api/recipe/', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens?.access),
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        navigate("/");
    };

    const handleChange = (e) =>{
        console.log(e.target.value)
        if(e.target.name === "nameRecipe"){
            setFormData({...formData, "name": e.target.value});
        }else if(e.target.name === "selectCategory"){
            setFormData({...formData, "category": e.target.value})
        }else if (e.target.name === "selectPrivacy"){
            setFormData({...formData, "privacy": e.target.value})
        };
    }

    const getCategories = async () => {
        let response = await fetch('/api/categories/',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens?.access)
            }
        });
        let data = await response.json()
        setCategories(data)
    };

    useEffect(() => {
        getCategories()
    }, []);

    return (
        <div>
            <form>
                <input className="input" type="text" name="nameRecipe" placeholder='Name of Recipe ...'  onChange={handleChange}/>
                <select name="selectCategory" onChange={handleChange}>
                    <option key="N/A">N/A</option>
                    {categories.map((category, index) => (
                        <option key={category.id}>
                            {category.name} <br/>
                        </option>
                    ))}
                </select>
                <select  name="selectPrivacy" onChange={handleChange}>
                    <option key={"private"}>Private</option>
                    <option key={"public"}>Public</option>
                    <option key={"friends"}>Friends</option>
                </select>
                <input class="input_style" type="submit" value="Submit" onClick={submitForm}/>
            </form>
        </div>
    )
}

export default RecipeForms  