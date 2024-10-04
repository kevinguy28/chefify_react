import React, {useRef, useEffect} from 'react';
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

  const handleInput = (event) => {
    const textarea = event.target;
    // Reset the height to 'auto' to shrink it if necessary
    textarea.style.height = 'auto';
    // Set the height to its scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
    // Update the value state
  };

  return (
    <div className={`card ${editMode && recipeId !== recipe.id ? "hide" : "x"}`}>
        <img src={food}/>
        <div className='card-content'>             
            <Link className="card-link" to={`/recipe/${recipe.id}`} key={index}>{recipe.name}</Link><br/>
            Status: <span className={`${recipe.privacy === "public" ? "card-status-public" : recipe.privacy === "private" ? "card-status-private" : "card-status-friends"}`}>{capitalize(recipe.privacy)}</span>
            <span className="card-edit" data-recipe-id={recipe.id} onClick={changeMode}><u>Edit</u></span><br/><hr />
            <form className={`${editMode ? "xxx" : "hide"}`}>
              <textarea onChange={handleInput} className='txt' row="6">{recipe.description}</textarea>
            </form>
            <p className={`${editMode ? "hide" : ""}`}>{formatDescription(recipe.description)}</p>
        </div>
    </div>
  )
}

export default RecipeCard
