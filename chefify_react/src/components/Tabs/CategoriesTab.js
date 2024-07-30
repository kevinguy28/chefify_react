import React, {useState, useEffect, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AuthContext from "../../context/AuthContext";

const CategoriesTab = () => {

    const location = useLocation();

    let [categories, setCategories] = useState([]);
    let {authTokens} = useContext(AuthContext)
    let [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        getCategories()
    },[]);

    // Handles Query Parameters

    const queryCategoryHandleClick = (category) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('category', category);
        return `/?${queryParams.toString()}`;
    }

    // Get Functions
    
    let getCategories = async () => {
        let response = await fetch('/api/categories/',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens?.access)
            }
        });
        let data = await response.json()
        setCategories(data)
    };

  return (
    <div>
        <h1>Categories</h1><hr/>
        {categories.map((category, index) => (
            <Link to={queryCategoryHandleClick(category.name)} key={category.id}>{category.name}<br/></Link> 
        ))}
    </div>
  )
}

export default CategoriesTab
