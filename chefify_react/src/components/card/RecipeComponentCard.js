import React from 'react';
import food from '../../styling/images/a.png';
import "../../styling/css/recipeComponentCard.css";


const RecipeComponent = ({component, index, handleChange, handleDelete, handleSubmit}) => {
  return (
    <div key={component.id} className="recipeComponent">
        <img src={food}/>
        <div className='recipeComponentCardHeader'>
            <span className='componentName'>{component.name}</span>
            <span data-component-id={component.id} data-type-del="component" className="btn del" onClick={handleDelete}>DEL</span>
        </div>
        <div className="recipeComponentForm-container">
            <hr/>
            <form id="recipeComponentForm" data-component-id={component.id} method="POST" key={index} onSubmit={handleSubmit}>
                <input className="recipeComponentFormField" type="number" min="0" step="any"  name="quantityInput" placeholder="Quantity" onChange={handleChange}/>
                <select className="recipeComponentFormField" name="unitInput" onChange={handleChange}>
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
                <input className="recipeComponentFormField" type="text" name="ingredientInput" placeholder="Add Ingredient" pattern="[A-Za-z\s]+" onChange={handleChange}/>
                <input className="recipeComponentFormField" type="submit" value="Submit"/>
            </form><hr/>

            {component.ingredientsList.map((ingredient) => (
                <div className='recipeComponentCardHeader'>
                    <span className="ingredientUnit" key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name} </span>
                    <span data-component-id={component.id} data-ingredient-id={ingredient.id} data-type-del="ingredient"className="btn-sml del" onClick={handleDelete}>DEL</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default RecipeComponent
