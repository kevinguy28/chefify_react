import React, {useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthContext";
import { useNavigate} from 'react-router-dom';
import { getCategories, createRecipe } from '../../utils/CRUD'; 


const RecipeForms = () => {

    const navigate = useNavigate();

    let {authTokens, user, getCsrfToken} = useContext(AuthContext);

    let [formData, setFormData] = useState({
        "name": "",
        "category": "N/A",
        "privacy": "private",
        "user_id": user.user_id,
    })
    let [categories, setCategories] = useState([]);

    const submitForm = async (e) =>{
        let csrfToken = getCsrfToken();
        e.preventDefault()
        createRecipe(authTokens, formData, csrfToken);
        navigate("/")
    }

    const handleChange = (e) =>{
        if(e.target.name === "nameRecipe"){
            setFormData({...formData, "name": e.target.value});
        }else if(e.target.name === "selectCategory"){
            setFormData({...formData, "category": e.target.value})
        }else if (e.target.name === "selectPrivacy"){
            setFormData({...formData, "privacy": e.target.value.toLowerCase()})
        };
    }

    useEffect(() => {
        const fetchData = async () => {
            let csrfToken = getCsrfToken()
            let {categoriesData} = await getCategories(authTokens, csrfToken);
            setCategories(categoriesData);
        };
        fetchData();
    }, []);

    return (
        <div>
            <form>
                <input className="input" type="text" name="nameRecipe" placeholder='Name of Recipe ...'  onChange={handleChange}/>
                <select name="selectCategory" onChange={handleChange}>
                    <option key="N/A">N/A</option>
                    {categories.map((category) => (
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
                <input type="submit" value="Submit" onClick={submitForm}/>
            </form>

            
        </div>
    )
}

export default RecipeForms  