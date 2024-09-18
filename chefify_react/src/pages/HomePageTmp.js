import React from 'react'
import CategoriesTab from '../components/tabs/CategoriesTab';
import RecipeTab from "../components/tabs/RecipeTab";
import ListTab from "../components/tabs/ListTab";
import '../styling/css/page.css';

const HomePage = () => {
  return (
    <div className="container homePage">
        <CategoriesTab />
        <RecipeTab />
        <ListTab typeList ="ingredientsList"/>
        <ListTab typeList ="shoppingList"/>
    </div>
  )
}

export default HomePage
