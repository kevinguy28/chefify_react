import React from 'react'
import food from "../../styling/images/a.png";

const RecipeComponentCard = ({component}) => {
  return (
    <div key={component.id} className="recipeComponent">
        <img src={food}/>
        <div className="ingredientUnits-container">
            <h1>{component.name}</h1>
            {component.ingredientsList.map((ingredient) => (
                <p key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name}</p>
            ))}
        </div>
    </div>
  )
}

export default RecipeComponentCard
