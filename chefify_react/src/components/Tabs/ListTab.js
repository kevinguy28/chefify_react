import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext';

const ListTab = ({typeList}) => {

    let { authTokens, user, getCsrfToken } = useContext(AuthContext)

    let [load, setLoad] = useState(true);
    let [formData, setFormData] = useState({
        name:  '',
        type: '',
    });
    let [list, setList] = useState([]);


    const handleKeyPress = (e) => {
        setFormData({...formData, type: typeList,});
        if(e.key === "Enter" && e.target.form.dataset.crud === "post"){
            addList(e);
        }else if(e.key === "Enter" && e.target.form.dataset.crud === "delete"){
            deleteFromList(e);
        };
      };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            'name': e.target.value,
        })
    };

    const addList = async (e) => {
        e.preventDefault();
        let csrfToken = getCsrfToken()
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
      
        document.querySelectorAll(".input").forEach(element => {element.value = ""});
    
        if(response.status === 200){setLoad(true)};
        
    };

    const getList = async () => {
        let csrfToken = getCsrfToken();
        let response = await fetch(`/api/profile/${user.user_id}/`, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access),
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });
        
        let data = await response.json();

        if(typeList === "ingredientsList"){
            setList(data.ingredientsList)
        }else if(typeList === "shoppingList"){
            setList(data.shoppingList)
        };
        setLoad(false)
    };

    const deleteFromList = async (e) =>{
        e.preventDefault();
        let csrfToken = getCsrfToken()
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
      
        document.querySelectorAll(".input").forEach(element => {element.value = ""});
    
        if(response.status === 200){setLoad(true)};
      }

    useEffect(() =>{
        if(load){getList()};
    }, [list, load]);

  return (
    <div>
        {typeList === "ingredientsList" ? <h1>Your Ingredients</h1> : <h1>Shopping List</h1>}<hr/>

        <form method="post" onKeyDown={handleKeyPress} data-crud="post">
            <input class="input" type="text" name="list_add" placeholder="Add Ingredient ..." onChange={handleChange}/>
        </form>
        <form method="post" onKeyDown={handleKeyPress} data-crud="delete">
            <input class="input" type="text" name="list_remove" placeholder="Remove Ingredient ..." onChange={handleChange}/>
        </form>

        <div>
            {list.map((ingredient, index)=>(
            <p key={index}>{ingredient.name}</p>
            ))}
      </div>
    </div>
  )
}

export default ListTab
