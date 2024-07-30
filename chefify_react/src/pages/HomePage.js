import React from 'react'
import CategoriesTab from '../components/Tabs/CategoriesTab';
import RecipeTab from "../components/Tabs/RecipeTab";
import ListTab from "../components/Tabs/ListTab";

const HomePage = () => {
  return (
    <div className="container">
        <CategoriesTab />
        <RecipeTab />
        <ListTab typeList ="ingredientsList"/>
        <ListTab typeList ="shoppingList"/>
    </div>
  )
}

export default HomePage
