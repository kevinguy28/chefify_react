import React, {useState, useEffect, useContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import AuthContext from "../../context/AuthContext.js";
import {getCategories} from "../../utils/CRUD.js";

const CategoriesTab = () => {

    const location = useLocation();
    let navigate = useNavigate();

    let [categories, setCategories] = useState([]);
    let {authTokens, getCsrfToken} = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            let csrfToken = getCsrfToken();
            const {categoriesData} = await getCategories(authTokens, csrfToken)
            setCategories(categoriesData)
        };
        fetchData();
    },[]);

    // Handles Query Parameters

    const queryCategoryHandleClick = (category) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('category', category);
        navigate(`/?${queryParams.toString()}`);
    }

  return (
    <div>
        <h1>Categories</h1><hr/>
        {categories.map((category, index) => (
            <div onClick={() => queryCategoryHandleClick(category.name)} key={category.id}>{category.name}<br/></div> 
        ))}
    </div>
  )
}

export default CategoriesTab
