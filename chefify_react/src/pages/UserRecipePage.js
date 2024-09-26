import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { getUserRecipes } from '../utils/CRUD';
import {Link} from 'react-router-dom'

import '../styling/css/userRecipePage.css';
import food from '../styling/images/a.png';
import { capitalize } from '../utils/Functions';

const UserRecipePage = () => {
    let {user, getCsrfToken, authTokens} = useContext(AuthContext);

    let [userRecipes, setUserRecipes] = useState([]);
    let [editMode, setEditMode] = useState(false);

    const fetchUserRecipes = async () =>{
        let csrfToken = getCsrfToken();
        let response = await getUserRecipes(user.user_id, authTokens, csrfToken);
        if(response.ok){
            let userRecipes = await response.json();
            console.log(userRecipes);
            setUserRecipes(userRecipes);
        }
    };

    const changeMode = (e) =>{
        if(editMode === false){
            setEditMode(true);
        }else if(editMode === true){
            setEditMode(false);
        }
    }

    useEffect( () => {
        fetchUserRecipes();
    }, [editMode]);

    return (
        <div className={`page-container ${editMode ? "userRecipePageEdit" : "userRecipePage"}`}>
            <div className='card-container '>
                {userRecipes.map((recipe, index) => (
                <div className="recipe-content card">
                    <img src={food}/>
                    <div className='card-content'>             
                    <Link className="card-link" to={`/recipe/${recipe.id}`} key={index}>{recipe.name}</Link><br/>
                    Status: <span className={`${recipe.privacy === "public" ? "card-status-public" : recipe.privacy === "private" ? "card-status-private" : "card-status-friends"}`}>{capitalize(recipe.privacy)}</span>
                    <span className="card-edit" onClick={changeMode}><u>Edit</u></span><br/><hr />
                    <p>More content More content More content More content More content More content More content More content More content</p>
                    </div>
                </div>
                ))}
            </div>
            <div>
                <div className={`${editMode ? "hide" : ""}`}>
                    Idk what I'm putting here
                </div>
                <div className={`${editMode ? "" : "hide"}`}>
                    Should be edit mode
                </div>
            </div>
        </div>
    )
}
export default UserRecipePage
