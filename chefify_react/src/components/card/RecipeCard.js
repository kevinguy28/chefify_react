import React from 'react';
import {Link} from 'react-router-dom';

import { capitalize } from '../../utils/Functions';
import food from '../../styling/images/a.png';

import "../../styling/css/recipeCard.css";

const RecipeCard = ({changeMode, index, editMode, recipe, recipeId}) => {

  const formatDescription = (description) =>{
    if(description.length === 0) return "No description is currently set."
    if(description.length < 400) return description.padEnd(400);
    return description;
  };

  return (
    <div className={`card ${editMode && recipeId !== recipe.id ? "hide" : ""}`}>
        <img src={food}/>
        <div className='card-content'>             
            <Link className="card-link" to={`/recipe/${recipe.id}`} key={index}>{recipe.name}</Link><br/>
            Status: <span className={`${recipe.privacy === "public" ? "card-status-public" : recipe.privacy === "private" ? "card-status-private" : "card-status-friends"}`}>{capitalize(recipe.privacy)}</span>
            <span className="card-edit" data-recipe-id={recipe.id} onClick={changeMode}><u>Edit</u></span><br/><hr />
            <p class="preserve-spaces">{formatDescription(recipe.description)}</p>
        </div>
    </div>
  )
}

export default RecipeCard
