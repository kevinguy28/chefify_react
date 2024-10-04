import React from 'react';
import food from '../../styling/images/a.png';

const RecipeComponent = ({component, index, handleChange, handleDelete, handleSubmit}) => {
  return (
    <div key={component.id} className="recipeComponent">
        <img src={food}/>
        <h1>{component.name}<span data-component-id={component.id} data-type-del="component" className="del-btn" onClick={handleDelete}>DEL</span> </h1>
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
                <p className="ingredientUnit" key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name} 
                <span data-component-id={component.id} data-ingredient-id={ingredient.id} data-type-del="ingredient"className="del-btn" onClick={handleDelete}>DEL</span></p>
            ))}
        </div>
    </div>
  )
}

export default RecipeComponent
