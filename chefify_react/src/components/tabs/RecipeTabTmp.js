import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import '../../styling/css/recipe.css';

const RecipeTab = () => {

  let {authTokens} = useContext(AuthContext)
  let [recipes, setRecipes] = useState([]);
  let [load, setLoad] = useState(true);

  const getRecipes = async () => {
    const queryParams = new URLSearchParams(location.search); 
    let response = await fetch(`/api/recipe/?${queryParams.toString()}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
        },
    });
    let data = await response.json()
    setRecipes(data)
    setLoad(false)
};

  useEffect(() => {
    if(load){getRecipes();};
  },[recipes, load]);

  return (
    <div> 
      <h1>Community Recipes</h1><hr /> 
      <Link to={`/recipe/form`}>Create Recipe</Link><br/>
      <div className='recipe-section'>
        {recipes.map((recipe, index) => (
          <div className="recipe-content">
            <Link to={`/recipe/${recipe.id}`} key={index}>{recipe.name}<br/></Link>
            <p>More content</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeTab
