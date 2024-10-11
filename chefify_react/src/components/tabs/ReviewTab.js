import React from 'react'
import "../../styling/css/reviewTab.css";

const ReviewTab = ({backPage, hasMoreReviews, loadMore, reviewPages, reviews}) => {
return (
    <div className='reviewTab'>
        <div><u>Reviews</u></div>
        {reviews?.map(item => (
            <p key={item.id}> {item.user.username} - {item.review_text}</p>
        ))}
        {hasMoreReviews && (
            <button className={reviewPages === 1 ? "hide" : ""} style={{ color: 'black'}} name="goBackReview" onClick={backPage}>Go Back</button>
        )}
        {hasMoreReviews && (
            <button className={hasMoreReviews === false ? "hide" : ""} style={{ color: 'black'}} name="loadMoreReview" onClick={loadMore}>Load More</button>
        )}
    </div> 
)}

export default ReviewTab
