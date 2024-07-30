import React, {useState, useEffect, useContext} from 'react';
import CommunityRecipeItem from '../CommunityRecipeItem';
import AuthContext from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const RecipeTab = () => {

  let {authTokens } = useContext(AuthContext)
  let [recipes, setRecipe] = useState([]);
  let [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
      // getRecipe()
  },[]);

  return (
    <div> 
      <h1>Community Recipes</h1><hr /> 

      <Link to={`/recipe/form`}>Create Recipe</Link>

      

    </div>
  )
}

export default RecipeTab
