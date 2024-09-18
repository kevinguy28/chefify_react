import React, { useState, useEffect, useContext} from 'react';
import { useParams   } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import { getRecipeComponents, submitIngredientUnitForm, submitRecipeComponentForm } from '../../utils/CRUD';

const RecipeComponentForm = () => {

    let {authTokens, user, getCsrfToken} = useContext(AuthContext);
    let { recipeId } = useParams();
    let [recipeComponents, setRecipeComponents] = useState([]);
    let [load, setLoad] = useState(true);

    let [formData, setFormData] = useState({
        "name": "",
        "ingredient": "",
        "unit": "tbsp",
        "quantity": "",
    });

    const handleKeyPress = async (e) =>{
        if(e.key === "Enter"){
            let csrfToken = getCsrfToken()
            let response = await submitRecipeComponentForm(e, authTokens, formData, recipeId, csrfToken);
            if(response.status === 200){setLoad(true);};
        };
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
        };
    };

    const handleClick = async(e, component) =>{
        e.preventDefault();
        let csrfToken = getCsrfToken();
        let response = await submitIngredientUnitForm(e, authTokens, formData, component.id, csrfToken);
        if(response.status === 200){setLoad(true);};
    }

    useEffect(()=>{
        const fetchData = async() =>{
            if(load){
                let csrfToken = getCsrfToken()
                let {recipeComponentsData} = await getRecipeComponents(authTokens, recipeId, csrfToken);
                setRecipeComponents(recipeComponentsData);
                setLoad(false)
            };
        };
        fetchData();
    }, [recipeComponents, load]);

    return (
        <div className='page-container recipeComponentForm'>
            <div>
                <form method="post" onKeyDown={handleKeyPress}>
                    <input className="input" name="componentInput" placeholder="Add a new recipe component ... " onChange={handleChange}/>
                </form>
                
                {recipeComponents.map((component, index) => (
                    <form method="POST" class="component-add" key={index}>
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
                        <input class="input_style" type="submit" value="Submit" onClick={() => handleClick(component)}/>
                    </form>
                ))}
            </div>
            <div>
                {recipeComponents.map((component) => (
                    <div key={component.id}>
                        <h1>{component.name}</h1>
                        <div>
                            {component.ingredientsList.map((ingredient) => (
                                <p key={ingredient.id}>{ingredient.ingredient.name}</p>
                            ))}
                        </div>
                    </div>
                ))}

            </div>

        </div>
  )
}

export default RecipeComponentForm
