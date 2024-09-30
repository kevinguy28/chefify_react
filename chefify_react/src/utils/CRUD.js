// User


export const getUser = async(authTokens, userId, csrfToken) =>{
    let response = await fetch(`/api/user/${userId}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    
    let user = await response.json()
    return user
}

export const postUser = async(csrfToken, e) => {
    let response = await fetch(`/api/register/`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({'username': e.target.username.value, 'password':e.target.password.value})
    })
    return response
};

export const getUserRecipes = async (userId, authTokens, csrfToken) =>{
    let response = await fetch(`api/user/recipes/${userId}`, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    return response;
}

// Categories

export const getCategories = async (authTokens, csrfToken) => {
    let response = await fetch('/api/categories/',{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    let categoriesData = await response.json();
    return {categoriesData};
};

// Ingredient Unit Form

export const submitIngredientUnitForm = async (authTokens, formData, componentId, csrfToken) => {
    let response = await fetch(`/api/recipe-components/${componentId}/ingredient-unit`,{
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    
    return response;
};

export const deleteIngredientUnit = async(authTokens, componentId, ingredientUnitId, csrfToken) => {
    let response = await fetch(`/api/recipe-components/${componentId}/ingredient-unit/${ingredientUnitId}/`, {
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    return response;
};


// Recipes

export const createRecipe = async (authTokens, formData, csrfToken) => {
    let response = await fetch('/api/recipe/', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};

export const getRecipes = async (authTokens, location, csrfToken) => {
    const queryParams = new URLSearchParams(location.search); 
    let response = await fetch(`/api/recipe/?${queryParams.toString()}/`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    let recipesData = await response.json()
    return { recipesData }
};

export const getRecipe = async (authTokens, recipeId, csrfToken) =>{
    let response = await fetch(`/api/recipe/${recipeId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    let recipeData = await response.json()
    return {recipeData}
};

// Review

export const postReview = async(authTokens, formData, csrfToken) =>{
    let response = await fetch(`/api/review/`, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};

export const getUserReview = async(authTokens, recipeId, userId, csrfToken) =>{
    let response = await fetch(`/api/review/user-review/${recipeId}/${userId}`, {
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    
    return response
};

export const getReviews = async(authTokens, recipeId, page, csrfToken)=>{
    let response = await fetch(`/api/review/${recipeId}?page=${page}`, {
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    
    return response
};

export const putReview = async(authTokens, recipeId, formData, csrfToken) =>{
    let response = await fetch(`/api/review/${recipeId}/`, {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};

export const deleteReview = async(authTokens, reviewId, csrfToken) =>{
    let response = await fetch(`/api/review/${reviewId}/`, {
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    return response
};
// Recipe Components

export const submitRecipeComponentForm = async (authTokens, formData, recipeId, csrfToken) =>{
    let response = await fetch(`/api/recipe-components/${recipeId}/`,{
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    // document.querySelectorAll(".input").forEach(element => {element.value = ""});
    return response
};

export const getRecipeComponents = async (authTokens, recipeId, csrfToken) =>{
    let response = await fetch(`/api/recipe-components/${recipeId}/`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    let recipeComponentsData = await response.json();
    return {recipeComponentsData};
}

// Profile --> IngredientsList or ShoppingList

export const addList = async (e, user, authTokens, formData, csrfToken) => {
    e.preventDefault();
    let response = await fetch(`/api/profile/${user.user_id}/`, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};

export const deleteFromList = async (e, user, authTokens, formData, csrfToken) =>{
    e.preventDefault();
    let response = await fetch(`/api/profile/${user.user_id}/`, {
      method: "DELETE",
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    return response
};

export const getList = async (user, authTokens, csrfToken) => {
    let response = await fetch(`/api/profile/${user.user_id}/`, {
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    });
    
    let listData = await response.json();
    return { listData }
};

// Messages

export const postMessage = async (authTokens, recipeId, formData, csrfToken) => {
    let response = await fetch(`/api/messages/${recipeId}/`, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};

export const getMessages = async (authTokens, recipeId, page, csrfToken) => {
    let response = await fetch(`/api/messages/${recipeId}?page=${page}`, {
        header: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
    })
    return response;
};

// Steps

export const getSteps = async (authTokens, csrfToken, recipeId) => {
    let response = await fetch(`/api/steps/${recipeId}`, {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens?.access),
        'X-CSRFToken': csrfToken,
      }
    });
    let stepsData = await response.json();
    return {stepsData};
};

export const postSteps = async (authTokens, csrfToken, formData, recipeId) =>{
    let response = await fetch(`/api/steps/${recipeId}/`, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access),
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    });
    return response
};