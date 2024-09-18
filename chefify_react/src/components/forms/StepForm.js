import React, {useState, useContext} from 'react';
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom'

const StepForm = () => {

    let {authTokens, user, getCsrfToken} = useContext(AuthContext);

    let { recipeId } = useParams();
    let navigate = useNavigate();

    let [formData, setFormData] = useState({
        "user_id": user.user_id,
        "description": "",
    });

    const handleChange = (e) =>{
        setFormData({...formData, "description": e.target.value});
    }

    const submitForm = async (e) => {
        e.preventDefault();
        let csrfToken = getCsrfToken();
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
        navigate(-1);
    };

  return (
    <div>
        <form>  
            <textarea name="textarea" rows="20" cols="60" onChange={handleChange}></textarea>
            <input type="submit" value="Submit" onClick={submitForm}/>
        </form>
    </div>
  )
}

export default StepForm
