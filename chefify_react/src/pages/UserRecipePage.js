import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import { getUserRecipes, getRecipeComponents, submitRecipeComponentForm, submitIngredientUnitForm} from '../utils/CRUD';
import { capitalize } from '../utils/Functions';

import '../styling/css/userRecipePage.css';
import food from '../styling/images/a.png';

const UserRecipePage = () => {
    let {user, getCsrfToken, authTokens} = useContext(AuthContext);

    let [userRecipes, setUserRecipes] = useState([]);
    let [recipeComponents, setRecipeComponents] = useState([]);

    let [editMode, setEditMode] = useState(false);
    let [recipeId, setRecipeId] = useState(null);
    let [formData, setFormData] = useState({
        "name": "",
        "ingredient": "",
        "unit": "tbsp",
        "quantity": "",
    });

    const fetchUserRecipes = async () =>{
        let csrfToken = getCsrfToken();
        let response = await getUserRecipes(user.user_id, authTokens, csrfToken);
        if(response.ok){
            let userRecipes = await response.json();
            setUserRecipes(userRecipes);
        }
    };

    const fetchRecipeComponents = async (id) =>{
        let csrfToken = getCsrfToken();
        let {recipeComponentsData} = await getRecipeComponents(authTokens, id, csrfToken);
        setRecipeComponents(recipeComponentsData);
    };

    const handleChange = (e) =>{
        if(e.target.name === "quantityInput"){
            setFormData({
                ...formData,
                "name": "",
                "quantity": e.target.value,
            });
            console.log(e.target.value)
        }else if(e.target.name === "unitInput"){
            setFormData({
                ...formData,
                "name":"",
                "unit": e.target.value
            });
            console.log(e.target.value)
        }else if(e.target.name === "ingredientInput"){
            setFormData({
                ...formData,
                "name": "",
                "ingredient": e.target.value
            });
            console.log(e.target.value)
        }else if(e.target.name === "componentInput"){
            setFormData({
                ...formData,
                "name": e.target.value
            });
            console.log(e.target.value)
        };
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let csrfToken = getCsrfToken();
        if(e.target.id === "ingredientUnitForm"){
            let response = await submitIngredientUnitForm(authTokens, formData, e.target.getAttribute("data-component-id"), csrfToken);
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
            };
        };
    }

    const changeMode = (e) =>{
        if(editMode === false){
            fetchRecipeComponents(e.currentTarget.getAttribute("data-recipe-id"));
            setRecipeId(e.currentTarget.getAttribute("data-recipe-id"));
            setEditMode(true);
        }else if(editMode === true){
            setEditMode(false);
            setRecipeId(null);
            setRecipeComponents([]);
        }
    }

    useEffect( () => {
        fetchUserRecipes();
    }, [editMode, recipeComponents]);

    return (
        <div className={`page-container ${editMode ? "userRecipePageEdit" : "userRecipePage"}`}>
            <div className={`card-container ${editMode ? "highlight-bg" : ""}`}>
                {userRecipes.map((recipe, index) => (
                <div className="card">
                    <img src={food}/>
                    <div className='card-content'>             
                    <Link className="card-link" to={`/recipe/${recipe.id}`} key={index}>{recipe.name}</Link><br/>
                    Status: <span className={`${recipe.privacy === "public" ? "card-status-public" : recipe.privacy === "private" ? "card-status-private" : "card-status-friends"}`}>{capitalize(recipe.privacy)}</span>
                    <span className="card-edit" data-recipe-id={recipe.id} onClick={changeMode}><u>Edit</u></span><br/><hr />
                    <p>More content More content More content More content More content More content More content More content More content</p>
                    </div>
                </div>
                ))}
            </div>
            <div>
                <div className={`${editMode ? "hide" : ""}`}>
                    Idk what I'm putting here
                </div>
                <div className={`${editMode ? "card-container" : "hide"}`}>
                    <form method="post">
                        <input className="input" name="componentInput" placeholder="Add a new recipe component ... " onChange={handleChange}/>
                    </form>

                    {recipeComponents.map((component, index) => (
                        <div key={component.id} className="recipeComponent">
                            <img src={food}/>
                            <h1>{component.name}</h1>
                            <div className="ingredientUnits-container">
                                <form id="ingredientUnitForm" data-component-id={component.id} method="POST" class="component-add" key={index} onSubmit={handleSubmit}>
                                    <input class="input_style" type="number" min="0" step="any"  name="quantityInput" placeholder="Quantity" onChange={handleChange}/>
                                    <select class="input_style" name="unitInput" onChange={handleChange}>
                                        <option value="tbsp">Tablespoon</option>
                                        <option value="tsp">Teaspoon</option>
                                        <option value="cup">Cup</option>
                                        <option value="oz">Ounce</option>
                                        <option value="g">Gram</option>
                                        <option value="kg">Kilogram</option>
                                        <option value="ml">Milliliter</option>
                                        <option value="L">Liter</option>
                                        <option value="pinch">Pinch</option>
                                        <option value="dash">Dash</option>
                                    </select>
                                    <input class="input_style" type="text" name="ingredientInput" placeholder="Add Ingredient" pattern="[A-Za-z]+" onChange={handleChange}/>
                                    <input class="input_style" type="submit" value="Submit"/>
                                </form><hr/>

                                {component.ingredientsList.map((ingredient) => (
                                    <p key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default UserRecipePage
