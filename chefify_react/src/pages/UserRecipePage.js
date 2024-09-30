import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import { getUserRecipes, getRecipeComponents, submitRecipeComponentForm, submitIngredientUnitForm, deleteIngredientUnit, getSteps, postSteps} from '../utils/CRUD';
import { capitalize, clearForms} from '../utils/Functions';

import '../styling/css/userRecipePage.css';
import food from '../styling/images/a.png';

const UserRecipePage = () => {

    let {user, getCsrfToken, authTokens} = useContext(AuthContext);

    let [userRecipes, setUserRecipes] = useState([]);
    let [recipeComponents, setRecipeComponents] = useState([]);

    let [editMode, setEditMode] = useState(false);
    let [recipeId, setRecipeId] = useState(null);
    let [steps, setSteps] = useState([]);
    let [formData, setFormData] = useState({
        "name": "",
        "ingredient": "",
        "unit": "tbsp",
        "quantity": "",
        "user_id": user.user_id,
        "description": "",
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

    const fetchUserSteps = async (id) =>{
        let csrfToken = getCsrfToken();
        let {stepsData} = await getSteps(authTokens, csrfToken, id);
        setSteps(stepsData);
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
        }else if(e.target.name === "stepsText"){
            setFormData({...formData, 
                "description": e.target.value
            });
        };
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let csrfToken = getCsrfToken();
        if(e.target.id === "ingredientUnitForm"){
            let response = await submitIngredientUnitForm(authTokens, formData, e.target.getAttribute("data-component-id"), csrfToken);
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
                setFormData({"name": "", "ingredient": "", "unit": "tbsp", "quantity": "", "user_id": user.user_id, "description": "",});
            };
        }else if(e.target.id === "createUnitForm"){
            let response = await submitRecipeComponentForm(authTokens, formData, recipeId, csrfToken);
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
                setFormData({"name": "", "ingredient": "", "unit": "tbsp", "quantity": "", "user_id": user.user_id, "description": "",});
            };
        }else if(e.target.id === "stepsForm"){
            console.log('hello')
            let response = await postSteps(authTokens, csrfToken, formData, recipeId);
            if(response.status === 200){
                fetchUserSteps();
                setFormData({"name": "", "ingredient": "", "unit": "tbsp", "quantity": "", "user_id": user.user_id, "description": "",});
            };
        };
        clearForms();
    }

    const changeMode = (e) =>{
        if(editMode === false){
            fetchRecipeComponents(e.currentTarget.getAttribute("data-recipe-id"));
            fetchUserSteps(e.currentTarget.getAttribute("data-recipe-id"));
            setRecipeId(e.currentTarget.getAttribute("data-recipe-id"));
            setEditMode(true);
        }else if(editMode === true){
            setEditMode(false);
            setRecipeId(null);
            setRecipeComponents([]);
            setSteps([]);
        }
    }

    const handleDelete = async (e) =>{
        let csrfToken = getCsrfToken();
        let response = await deleteIngredientUnit(authTokens, e.currentTarget.getAttribute("data-component-id"), e.currentTarget.getAttribute("data-ingredient-id"), csrfToken);
        if(response.status === 200){
            fetchRecipeComponents(recipeId);
        }
    }

    useEffect( () => {
        fetchUserRecipes();
    }, [editMode, recipeComponents, steps]);

    return (
        <div className={`page-container ${editMode ? "userRecipePageEdit" : "userRecipePage"}`}>
            <div className={`${editMode ? "highlight-bg hide" : "card-container"}`}>
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
            <div className='tmp2'>
                <div className={`${editMode ? "hide" : ""}`}>
                    Idk what I'm putting here
                </div>
                <div className={`${editMode ? "card-container" : "hide"}`}>

                    <div className='createUnitForm-width'>
                        <form id="createUnitForm"method="post" onSubmit={handleSubmit}>
                            <input className="ingredientUnitFormField" name="componentInput" placeholder="Add a new recipe component ... " onChange={handleChange}/>
                            <input className="ingredientUnitFormField" type="submit" value="Submit"/>
                        </form>
                    </div>

                    {recipeComponents.map((component, index) => (
                        <div key={component.id} className="recipeComponent">
                            <img src={food}/>
                            <h1>{component.name}</h1>
                            <div className="ingredientUnits-container">
                                <hr/>
                                <form id="ingredientUnitForm" data-component-id={component.id} method="POST" key={index} onSubmit={handleSubmit}>
                                    <input className="ingredientUnitFormField" type="number" min="0" step="any"  name="quantityInput" placeholder="Quantity" onChange={handleChange}/>
                                    <select className="ingredientUnitFormField" name="unitInput" onChange={handleChange}>
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
                                    <input className="ingredientUnitFormField" type="text" name="ingredientInput" placeholder="Add Ingredient" pattern="[A-Za-z\s]+" onChange={handleChange}/>
                                    <input className="ingredientUnitFormField" type="submit" value="Submit"/>
                                </form><hr/>

                                {component.ingredientsList.map((ingredient) => (
                                    <p className="ingredientUnit" key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name} <span data-component-id={component.id} data-ingredient-id={ingredient.id} className="del-btn" onClick={handleDelete}>DEL</span></p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`tmp3 ${editMode ? "" : "hide"}`}>
                <form id="stepsForm" onSubmit={handleSubmit}>  
                    <textarea className="textarea" name="stepsText"  onChange={handleChange}></textarea>
                    <input type="submit" value="Submit"/>
                </form>
                <div className='card-container'>
                    {steps?.map ((step, index) => (
                        <div className='container stepsCard'>
                            <h1 className="header-font-size">Step {index+1} {step.title && <span> - {step.title}</span>}</h1><hr/>
                            <p key={index} className="stepsDescription">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default UserRecipePage
