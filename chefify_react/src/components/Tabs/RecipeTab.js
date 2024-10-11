import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../../context/AuthContext.js';
import { Link, useLocation } from 'react-router-dom';

import {getRecipes} from "../../utils/CRUD.js";

import '../../styling/css/recipeTab.css';
import food from '../../styling/images/a.png';

const RecipeTab = () => {

  const location = useLocation();

  let {authTokens} = useContext(AuthContext)
  let [recipes, setRecipes] = useState([]);
  let [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (load) {
        const { recipesData } = await getRecipes(authTokens, location); 
        setRecipes(recipesData)
        setLoad(false);
      }
    };
    fetchData();
  }, [location, load]);

  useEffect(() => {
    setLoad(true)
  }, [location]);

  return (
    <div> 
      <h1>Community Recipes</h1><hr /> 
      <Link to={`/recipe/form`}>Create Recipe</Link><br/>

      <div className='card-container '>
        {recipes.map((recipe, index) => (
          <Link className="card pop link"  to={`/recipe/${recipe.id}`} key={index}>
            <img src={food}/>
            <div className='card-content'>             
              <h1>{recipe.name}<br/></h1>
              <hr />
              <p>{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecipeTab
