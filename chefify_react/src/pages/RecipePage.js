import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams   } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styling/css/page.css';
import { getSteps, getMessages, getRecipeComponents, postMessage, getRecipe, postReview, putReview, deleteReview, getUserReview, getReviews} from '../utils/CRUD';
import food from '../styling/images/a.png';
import {ReactComponent as MyIcon}  from '../styling/svg/star.svg';
import "../styling/css/recipePage.css";

const RecipePage = () => {

  let { recipeId } = useParams();
  let {authTokens, getCsrfToken, user } = useContext(AuthContext);
  let [steps, setSteps] = useState([]);
  let [messages, setMessages] = useState([]);
  let [recipe, setRecipe] = useState([]);
  let [userReview, setUserReview] = useState([]);
  let [hasReview, setHasReview] = useState(false)
  let [recipeComponents, setRecipeComponent] = useState([]);
  let [load, setLoad] = useState(true);
  let [editOnMode, setEditOn] = useState(false);
  let [editOffMode, setEditOff] = useState(false);
  let [submitMode, setSubmitMode] = useState(true);
  let [reviews, setReviews] = useState([]);
  let [reviewPages, setReviewPages] = useState(1);
  let [gotReviews, setGotReviews] = useState(false);
  let [hasMoreReviews, setHasMoreReviews] = useState(true)

  let [commentPages, setCommentPages] = useState(1);
  let [gotComments, setGotComments] = useState(false);
  let [hasMoreComments, setHasMoreComments] = useState(true) 

  let [formData, setFormData] = useState({
    "body": "",
  });
  let [reviewForm, setReviewForm] = useState({
    "rating": 0.0,
    "review_text": "",
    "user_id": user.user_id,
    "recipe_id": recipeId,
  });

  const handleChange = (e) =>{
    if(e.target.name === "rating"){
      setReviewForm({
        ...reviewForm,
        "rating": e.target.value,
      });
    }else if(e.target.name === "review_text"){
      setReviewForm({
        ...reviewForm,
        "review_text": e.target.value,
      });
    }else{
      setFormData({
        ...formData,
        "body": e.target.value,      
      });
    };
  };

  const handleSubmit = async(e) =>{
    let csrfToken = getCsrfToken();
    if(e.target.name === "submitReview"){
      if(reviewForm.rating != 0.0){
        let response = await postReview(authTokens, reviewForm, csrfToken);
        if(response.status === 200){
          setEditOff(true);
          setEditOn(false);
          setSubmitMode(false);
          setLoad(true);
        };
      }else{
        alert("You cannot leave a review without a rating!");
      };
    }else if(e.target.name === "saveReview"){
      let response = await putReview(authTokens, recipeId, reviewForm, csrfToken);
      if(response.status === 200){
        setEditOff(true);
        setSubmitMode(false);
        setEditOn(false);
        setLoad(true);
      };
    }else if(e.target.name === "deleteReview"){
      let response = await deleteReview(authTokens, userReview.id, csrfToken);
      if(response.status === 200){
        document.getElementById(`rating${userReview.rating*2}`).checked = false;
        document.getElementById("reviewTextEdit").value = "";
        setReviewForm({
          ...reviewForm,
          "rating": 0.0,
          "review_text": "",
        })
        setSubmitMode(true);
        setEditOff(false);
        setEditOn(false);
        setLoad(true);
        setUserReview([]);
        setHasReview(false);
      };
    }else if(e.target.name === "submitComment"){
      let response = await postMessage(authTokens, recipeId, formData, csrfToken);
      if(response.status === 200){setLoad(true);};
    };
  };

  const changeMode = (e) =>{
    if(editOffMode === true){
      setEditOn(true);
      setEditOff(false);
      setSubmitMode(false);
    };
  };

  let fetchData = async () => {
    if(load){
      let csrfToken = getCsrfToken();

      let {stepsData} = await getSteps(authTokens, recipeId);
      let {recipeComponentsData} = await getRecipeComponents(authTokens, recipeId, csrfToken);
      let {recipeData} = await getRecipe(authTokens, recipeId, csrfToken);
      setSteps(stepsData);
      setRecipe(recipeData);
      setRecipeComponent(recipeComponentsData);
      setLoad(false);
    };
  };

  let fetchUserReview = async () =>{
    let csrfToken = getCsrfToken();
    let userReviewResponse = await getUserReview(authTokens, recipeId, user.user_id, csrfToken);
    if(userReviewResponse.ok){
      let userReviewJson = await userReviewResponse.json();
      setUserReview(userReviewJson)
      setSubmitMode(false)
      setHasReview(true)
    }else{
      setHasReview(false)
    };
  }

  let fetchPublicReview = async () =>{
    try{
      let csrfToken = getCsrfToken();
      const response = await getReviews(authTokens, recipeId, reviewPages, csrfToken);
      if(response.ok){
        let data = await response.json();
        if(data.length > 0){
          setReviews(data);
          setGotReviews(true);
        }else{
          setHasMoreReviews(false);
        }
      }
    }catch(error){
      console.log("failed");
    };
  };

  let fetchComments = async () => {
    try{
      let csrfToken = getCsrfToken();
      let response = await getMessages(authTokens, recipeId, commentPages, csrfToken);
      if(response.ok){
        let data = await response.json();
        if(data.length > 0){
          setMessages(data);
          setGotComments(true);
        }else{
          setHasMoreComments(false);
        }
      }
    }catch(error){
      console.log("ss")
    }
  };

  let setUserStar = () =>{
    if(hasReview){
      document.getElementById(`rating${userReview.rating*2}`).checked = true;
      document.getElementById("reviewText").innerHTML = userReview.review_text;
      document.getElementById("reviewTextEdit").value = userReview.review_text;

      if(!editOnMode){
        setEditOff(true)
      }else if(editOnMode){
        setReviewForm({
          ...reviewForm,
          "rating": userReview.rating,
        });
      };
    };
  };

  let setRecipeStar = () =>{
    if(!load && (recipe.rating != 0)){
      const htmlElement = document.getElementById(`recipeRating${recipe.rating*2}`);
      if(htmlElement){
        htmlElement.checked = true;
      }
    }else if(!load && recipe.rating == 0){
      document.getElementById("averageReview").reset();
    };
  };


  const loadMore = (e) => {
    console.log(e.target.name)
    if(e.target.name === "loadMoreReview"){
      setReviewPages(prevPage => prevPage + 1);
    }else if(e.target.name === "loadMoreComments"){
      setCommentPages(prevPage => prevPage + 1);
    };
  };

  const backPage = (e) => {
    console.log(e.target.name)
    if(e.target.name === "goBackReview" && reviewPages != 1){
      setReviewPages(prevPage => prevPage - 1);
    }else if (e.target.name === "goBackComments" && commentPages != 1){
      setCommentPages(prevPage => prevPage - 1);
    }
  }

  useEffect(() =>{
    fetchData();
    fetchUserReview();
    setUserStar();
    setRecipeStar();
  },[load, steps, messages, editOnMode, editOffMode, submitMode, hasReview, gotReviews, gotComments])

  useEffect(() => {
    fetchPublicReview();
    fetchComments();
  },[reviewPages, commentPages, load]);
  
  return (
    <div className="page-container recipePage">
      <div>
        <Link to={`/recipe/${recipeId}/component-form`}>Add Ingredient Component</Link>
        <div className='recipeComponent-container'>
            {recipeComponents.map((component) => (
                <div key={component.id} className="recipeComponent">
                    <img src={food}/>
                    <h1>{component.name}</h1>
                    <div className="ingredientUnits-container">
                        {component.ingredientsList.map((ingredient) => (
                            <p key={ingredient.id}>{ingredient.quantity} {ingredient.unit}: {ingredient.ingredient.name}</p>
                        ))}
                    </div>
                </div>
            ))}
          </div>
      </div>
      <div>
        <Link to={`/recipe/${recipeId}/form`}>Add Steps</Link>
        <div className='steps-container recipePageContent-container'>
          {steps.map ((step, index) => (
            <div>
              <h1 className="header-font-size">Step {index+1} {step.title && <span> - {step.title}</span>}</h1>
              <p key={index} className="stepsDescription">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
      <Link to={`/recipe/${recipeId}/form`}>Add Steps</Link>
        <div>


          <div className='averageReview-container recipePageContent-container'>
            <h1 className="header-font-size">{recipe.name}</h1>
            <h3 className='subheading'>Public Rating:</h3>
            <div >
              <form id="averageReview">
                <fieldset class="rate non-clickable" onChange={handleChange} name="averageReview">
                  <input  type="radio" id="recipeRating10" name="averageReview" value="5.0" /><label for="recipeRating10" title="5 stars"></label>
                  <input  type="radio" id="recipeRating9" name="averageReview" value="4.5" /><label class="half" for="recipeRating9" title="4 1/2 stars"></label>
                  <input  type="radio" id="recipeRating8" name="averageReview" value="4.0" /><label for="recipeRating8" title="4 stars"></label>
                  <input  type="radio" id="recipeRating7" name="averageReview" value="3.5" /><label class="half" for="recipeRating7" title="3 1/2 stars"></label>
                  <input  type="radio" id="recipeRating6" name="averageReview" value="3.0" /><label for="recipeRating6" title="3 stars"></label>
                  <input  type="radio" id="recipeRating5" name="averageReview" value="2.5" /><label class="half" for="recipeRating5" title="2 1/2 stars"></label>
                  <input  type="radio" id="recipeRating4" name="averageReview" value="2.0" /><label for="recipeRating4" title="2 stars"></label>
                  <input  type="radio" id="recipeRating3" name="averageReview" value="1.5" /><label class="half" for="recipeRating3" title="1 1/2 stars"></label>
                  <input  type="radio" id="recipeRating2" name="averageReview" value="1.0" /><label for="recipeRating2" title="1 star"></label>
                  <input  type="radio" id="recipeRating1" name="averageReview" value="0.5" /><label class="half" for="recipeRating1" title="1/2 star"></label>
                </fieldset>
              </form> 
            </div>
            <div>Recipe by:   <span onClick={() => document.getElementById('review-section').scrollIntoView({ behavior: 'smooth' })} style={{float:"right"}}>Leave a review!</span></div>
          </div>
          <div className='recipePageContent-container' id="review-section">
            Your Review: 
          
            <input style={{float:"right"}} type="submit" value="Edit"  onClick={changeMode} id="editReview" className={editOffMode ? "" : "hide"} name="editReview"/>
            <input style={{float:"right"}} type="submit" value="Save" onClick={handleSubmit} id="saveReview" className={editOnMode ? "" : "hide"} name="saveReview"/>
            <input style={{float:"right"}} type="submit" value="Submit" onClick={handleSubmit} id="submitReview" className={submitMode ? "" : "hide"} name="submitReview"/>
            
            <br/>
            <fieldset className={`rate ${submitMode || editOnMode ? "" : "non-clickable"}`} onChange={handleChange} name="rating" id="starRating">
              <input  type="radio" id="rating10" name="rating" value="5.0" /><label for="rating10" title="5 stars"></label>
              <input  type="radio" id="rating9" name="rating" value="4.5" /><label class="half" for="rating9" title="4 1/2 stars"></label>
              <input  type="radio" id="rating8" name="rating" value="4.0" /><label for="rating8" title="4 stars"></label>
              <input  type="radio" id="rating7" name="rating" value="3.5" /><label class="half" for="rating7" title="3 1/2 stars"></label>
              <input  type="radio" id="rating6" name="rating" value="3.0" /><label for="rating6" title="3 stars"></label>
              <input  type="radio" id="rating5" name="rating" value="2.5" /><label class="half" for="rating5" title="2 1/2 stars"></label>
              <input  type="radio" id="rating4" name="rating" value="2.0" /><label for="rating4" title="2 stars"></label>
              <input  type="radio" id="rating3" name="rating" value="1.5" /><label class="half" for="rating3" title="1 1/2 stars"></label>
              <input  type="radio" id="rating2" name="rating" value="1.0" /><label for="rating2" title="1 star"></label>
              <input  type="radio" id="rating1" name="rating" value="0.5" /><label class="half" for="rating1" title="1/2 star"></label>
            </fieldset>
            
            <p id="reviewText" className={editOffMode ? "" : "hide"}></p>
            <form className='text-box'>
              <textarea className={submitMode || editOnMode ? "" : "hide"} id="reviewTextEdit" name="review_text" rows="20" cols="60" placeholder='Your review ...' onChange={handleChange}></textarea>
            </form>

            <input style={{float:"right"}} type="submit" value="Delete" onClick={handleSubmit} id="deleteReview" className={editOnMode ? "" : "hide"} name="deleteReview"/>
            <br className={editOnMode ? "" : "hide"}/>
          </div>
          <div>
            <div><u>Reviews</u></div>
            {reviews?.map(item => (
              <p key={item.id}> {item.user.username} - {item.review_text}</p>
            ))}
            {hasMoreReviews && (
              <button className={reviewPages == 1 ? "hide" : ""} style={{ color: 'black'}} name="goBackReview" onClick={backPage}>Go Back</button>
            )}
            {hasMoreReviews && (
              <button className={hasMoreReviews == false ? "hide" : ""} style={{ color: 'black'}} name="loadMoreReview" onClick={loadMore}>Load More</button>
            )}
          </div> 
        </div>
        <br/>
        <h1 className='header-font-size'>Comments</h1>
        <br/>
        {messages?.map((message,index) => (
          <p>{message.user.username}: {message.body}</p>
        ))}
        {hasMoreComments && (
          <button className={commentPages == 1 ? "hide" : ""} style={{ color: 'black'}} name="goBackComments" onClick={backPage}>Go Back</button>
        )}
        {hasMoreComments && (
          <button className={hasMoreComments == false ? "hide" : ""} style={{ color: 'black'}} name="loadMoreComments" onClick={loadMore}>Load More</button>
        )}
        <form className='text-box'>
          <textarea name="textarea" rows="20" cols="60" placeholder='Your comment ...' onChange={handleChange}></textarea>
          <input type="submit" value="Submit" onClick={handleSubmit} name="submitComment"/>
        </form>
      </div>
    </div>
  )
}

export default RecipePage
