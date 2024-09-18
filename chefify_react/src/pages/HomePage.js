import React from 'react'
import CategoriesTab from '../components/tabs/CategoriesTab';
import RecipeTab from "../components/tabs/RecipeTab";
import ListTab from "../components/tabs/ListTab";
import '../styling/css/page.css';
import bunThitNuong from "../styling/images/bun-thit-nuong.jpg";
import chickenAlfredo from "../styling/images/chicken-alredo.jpg";
import hawaiianizza from "../styling/images/hawaiian-pizza.jpg";
import '../App.css';
const HomePage = () => {
  return (
    <div className="page-container homePage">
      <header className="banner container">
        <div className="banner-content ">
          <h1>Great cooks</h1>
          <p>Use Chefify</p>
        </div>
      </header>

      <div className="container content-section">
        <CategoriesTab />
        <RecipeTab />
        <div>
          <ListTab typeList ="ingredientsList"/>
          <ListTab typeList ="shoppingList"/>
        </div>
      </div>

    </div>
  )
}

export default HomePage
