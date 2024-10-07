import React, {useState, useEffect, useContext} from 'react';
import Step from "./Step";
import RecipeCard from '../components/card/RecipeCard';
import RecipeComponentCard from '../components/card/RecipeComponentCard';

import AuthContext from '../context/AuthContext';
import { getUserRecipes, getRecipeComponents, submitRecipeComponentForm, submitIngredientUnitForm, deleteIngredientUnit, getSteps, postSteps, putStep, putStepsSwapOrder, deleteStep, deleteRecipeComponent} from '../utils/CRUD';
import { clearForms} from '../utils/Functions';

import RecipeForm from '../components/forms/RecipeForm';
import '../styling/css/userRecipePage.css';

const UserRecipePage = () => {

    let {user, getCsrfToken, authTokens} = useContext(AuthContext);

    let [userRecipes, setUserRecipes] = useState([]);
    let [recipeComponents, setRecipeComponents] = useState([]);

    let [load, setLoad] = useState(true);
    let [editMode, setEditMode] = useState(false);
    let [recipeId, setRecipeId] = useState(null);
    let [steps, setSteps] = useState([]);    
    let [editStepKey ,setEditStepKey] = useState(null);
    let [editStepId, setEditStepId] = useState(null);
    let [formData, setFormData] = useState({
        "name": "",
        "ingredient": "",
        "unit": "tbsp",
        "quantity": "",
        "user_id": user.user_id,
        "description": "",
        "title": "",
        "recipe_description": "",
        "step_description": "",
        "step_title": ""
    });


    const changeLoad= () =>{
        setLoad(true);
        clearForms();
    };

    const changeMode = (e) =>{
        if(editMode === false){
            fetchRecipeComponents(e.currentTarget.getAttribute("data-recipe-id"));
            fetchUserSteps(e.currentTarget.getAttribute("data-recipe-id"));
            setRecipeId(parseInt(e.currentTarget.getAttribute("data-recipe-id")));
            setEditMode(true);
        }else if(editMode === true){
            setEditMode(false);
            setRecipeId(null);
            setRecipeComponents([]);
            setSteps([]);
        }
    };

    const doSwap = async (step1, step2) =>{
        let csrfToken = getCsrfToken()
        let response = await putStepsSwapOrder(authTokens, csrfToken, step1, step2);
        if(response.status === 200){
            fetchUserSteps(recipeId);
        }
    };

    const fetchRecipeComponents = async (id) =>{
        let csrfToken = getCsrfToken();
        let {recipeComponentsData} = await getRecipeComponents(authTokens, id, csrfToken);
        setRecipeComponents(recipeComponentsData);
    };

    const fetchUserRecipes = async () =>{
        let csrfToken = getCsrfToken();
        let response = await getUserRecipes(user.user_id, authTokens, csrfToken);
        if(response.ok){
            let userRecipes = await response.json();
            setUserRecipes(userRecipes);
        }
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
        }else if(e.target.name === "unitInput"){
            setFormData({
                ...formData,
                "name":"",
                "unit": e.target.value
            });
        }else if(e.target.name === "ingredientInput"){
            setFormData({
                ...formData,
                "name": "",
                "ingredient": e.target.value
            });
        }else if(e.target.name === "componentInput"){
            setFormData({
                ...formData,
                "name": e.target.value
            });
        }else if(e.target.name === "stepsText"){
            setFormData({...formData, 
                "description": e.target.value
            });
        }else if(e.target.name === "stepsTitle"){
            setFormData({...formData,
                "title": e.target.value
            })
        }else if (e.target.name === "recipeDescription"){
            setFormData({
                ...formData,
                "recipe_description": e.target.value
            });
        }else if(e.target.name === `stepDescription${editStepKey}`){
            setFormData({
                ...formData,
                "step_description": e.target.value
            });
        }else if(e.target.name === `stepTitle${editStepKey}`){
            setFormData({
                ...formData,
                "step_title": e.target.value
            });
        };
    };

    const handleDelete = async (e) =>{
        let csrfToken = getCsrfToken();
        if(e.target.getAttribute("data-type-del") === "component"){
            let response = await deleteRecipeComponent(authTokens, csrfToken, e.target.getAttribute("data-component-id"));
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
            };
        }else if(e.target.getAttribute("data-type-del") === "ingredient"){
            let response = await deleteIngredientUnit(authTokens, csrfToken, e.currentTarget.getAttribute("data-component-id"), e.currentTarget.getAttribute("data-ingredient-id"));
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
            };
        }else if(e.target.getAttribute("data-type-del") === "step"){
            let response = await deleteStep(authTokens, csrfToken, e.target.getAttribute("data-step-id"));
            if(response.status === 200){
                fetchUserSteps(recipeId)
            }
        };
    };

    const handleSave = async (stepId) =>{
        let csrfToken = getCsrfToken();
        let response = await putStep(authTokens, csrfToken, formData, stepId);
        if(response.status === 200){
            setEditStepKey(null);
            setEditStepId(null);
            fetchUserSteps(recipeId);
            resetFormData();
        };
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let csrfToken = getCsrfToken();
        if(e.target.id === "recipeComponentForm"){
            let response = await submitIngredientUnitForm(authTokens, csrfToken, formData, e.target.getAttribute("data-component-id"));
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
                resetFormData();
            };
        }else if(e.target.id === "createUnitForm"){
            let response = await submitRecipeComponentForm(authTokens, formData, recipeId, csrfToken);
            if(response.status === 200){
                fetchRecipeComponents(recipeId);
                resetFormData();
            };
        }else if(e.target.id === "stepsForm"){
            let response = await postSteps(authTokens, csrfToken, formData, recipeId);
            if(response.status === 200){
                fetchUserSteps(recipeId);
                resetFormData();
            }else{
                alert("Title cannot be left empty!")
            };
        };
        clearForms();
    };

    const resetFormData = () =>{
        setFormData({"name": "", "ingredient": "", "unit": "tbsp", "quantity": "", "user_id": user.user_id, "description": "", "recipe_description": "", "step_description": "", "step_title" : ""});
    };

    const toggleStepEdit = async(key, stepId) =>{

        if(editStepKey !== null){
            await handleSave(editStepId);
        };

        let stepTitle = document.getElementById(`stepTitleTextArea${key}`).value;
        let stepDescription = document.getElementById(`stepDescriptionTextArea${key}`).value;
        setEditStepId(stepId);
        setEditStepKey(key);
        setFormData({
            ...formData,
            "step_description": stepDescription,
            "step_title": stepTitle,
        });
    };

    useEffect( () => {
        if(load){
            fetchUserRecipes();
            setLoad(false);
        };
    }, [load, editMode, recipeComponents, steps]);

    return (
        <div className={`page-container ${editMode ? "userRecipePageEdit" : "userRecipePage"}`}>
            <div className={`${editMode ? "recipe-section" : "card-container"}`}>
                {userRecipes.map((recipe, index) => (
                    <>
                        <RecipeCard changeMode={changeMode} index={index} editMode={editMode} recipe={recipe} recipeId={recipeId}/>
                        
                        <div className={`${editMode && recipeId === recipe.id ? "stepCreationCard" : "hide"}`}>
                         <h1><u>Create a step</u></h1>
                            <form className="x" id="stepsForm" onSubmit={handleSubmit}>  
                                <label className="loginLabel" type="text" for="stepsTitle">Title of step</label>
                                <textarea className="textarea" name="stepsTitle" onChange={handleChange} maxlength="50" placeholder='Title cannot be empty!'></textarea>
                                <label className="loginLabel" type="text" for="stepsText">Description of step</label>
                                <textarea className="textarea stepDescription" name="stepsText"  onChange={handleChange}></textarea>
                                <input className="sbt-btn" type="submit" value="Submit"/>
                            </form>
                        </div>
                    </>
                ))}
            </div>
            <div className={`${editMode ? "hide" : "recipeForm"}`}>
                <RecipeForm onSubmit={changeLoad}/>
            </div>
            <div className={`${editMode ? "display-column" : "hide"}`}>
                <div className='createUnitForm-width'>
                    <form id="createUnitForm"method="post" onSubmit={handleSubmit}>
                        <input className="ingredientUnitFormField" name="componentInput" placeholder="Add a new recipe component ... " onChange={handleChange}/>
                        <input className="ingredientUnitFormField" type="submit" value="Submit"/>
                    </form>
                </div>
                {recipeComponents.map((component, index) => (
                    <RecipeComponentCard index={index} component={component} handleDelete={handleDelete} handleChange={handleChange} handleSubmit={handleSubmit}/>
                ))}
            </div>
            <div className={`${editMode ? "" : "hide"}`}>
                <div className='card-container'>
                        <h1>Steps to the recipe</h1>
                        {steps?.map ((step, index) => (
                            <Step editStepKey={editStepKey} handleChange={handleChange} handleDelete={handleDelete} handleSave={handleSave} index={index} step={step} toggleStepEdit={toggleStepEdit} />
                        ))}
                </div>
            </div>
        </div>
    )
}
export default UserRecipePage
