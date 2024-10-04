import React, {useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthContext";
import { useNavigate} from 'react-router-dom';
import { getCategories, createRecipe } from '../../utils/CRUD'; 

import "../../styling/css/recipeForm.css";


const RecipeForms = ({editMode, onSubmit}) => {

    let {authTokens, user, getCsrfToken} = useContext(AuthContext);

    let [formData, setFormData] = useState({
        "name": "",
        "category": "N/A",
        "privacy": "private",
        "user_id": user.user_id,
    })
    let [categories, setCategories] = useState([]);

    const submitForm = async (e) =>{
        e.preventDefault()
        let csrfToken = getCsrfToken();
        let response = await createRecipe(authTokens, formData, csrfToken);
        if(response.status === 200){
          onSubmit();  
        };
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
        <div className='recipeForm'>
            <h1>Create Recipe<hr/></h1>
            <form onSubmit={submitForm}>
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
                <textarea name="review_text" rows="20" cols="60" placeholder='Descripition'></textarea>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default RecipeForms  