import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext.js';
import {getList, addList, deleteFromList} from "../../utils/CRUD.js";

const ListTab = ({typeList}) => {

    let { authTokens, user, getCsrfToken } = useContext(AuthContext)

    let [load, setLoad] = useState(true);
    let [list, setList] = useState([]);
    let [formData, setFormData] = useState({
        name:  '',
        type: '',
    });

    const handleKeyPress = async (e) => {
        setFormData({...formData, type: typeList,});

        if(e.key === "Enter"){
            let csrfToken = getCsrfToken();
            let response = null;
            if(e.target.form.dataset.crud === "post"){
                response = await addList(e, user, authTokens, formData, csrfToken);
            }else if(e.target.form.dataset.crud === "delete"){
                response = await deleteFromList(e, user, authTokens, formData, csrfToken);
            }
            if(response?.status === 200){setLoad(true);document.querySelectorAll(".input").forEach(element => {element.value = ""});};
        };
      };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            'name': e.target.value,
        })
    };

    useEffect(() =>{
        const fetchData = async () => {
            if (load) {
                let csrfToken = getCsrfToken();
                const { listData } = await getList(user, authTokens, csrfToken);
                if(typeList === "ingredientsList"){
                    listData?.ingredientsList.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });
                    setList(listData.ingredientsList);
                }else if(typeList === "shoppingList"){
                    listData?.shoppingList.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });
                    setList(listData.shoppingList);
                }
                setLoad(false);
            }
        };
        fetchData();
    }, [list, load]);

  return (
    <div>
        {typeList === "ingredientsList" ? <h1>Your Ingredients</h1> : <h1>Shopping List</h1>}<hr/>

        <form method="post" onKeyDown={handleKeyPress} data-crud="post">
            <input className="input" type="text" name="list_add" placeholder="Add Ingredient ..." onChange={handleChange}/>
        </form>
        <form method="post" onKeyDown={handleKeyPress} data-crud="delete">
            <input className="input" type="text" name="list_remove" placeholder="Remove Ingredient ..." onChange={handleChange}/>
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
