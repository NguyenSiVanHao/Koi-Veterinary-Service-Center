import React, { useState } from "react";
import "./Rating.css";
import { createRatingAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

function Rating({ appointmentId }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

console.log(appointmentId)

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      const feedbackData = {
        feedbackId: "",
        star: rating,
        description: feedback,
        appointmentId: appointmentId
      };

      console.log("Sending feedback data:", feedbackData);
      const response = await createRatingAPI(appointmentId, feedbackData);
      console.log("API response:", response);

      alert("Thank you for your feedback!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(`Error submitting rating: ${error.message || "Unknown error occurred"}`);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="rating-container">
      <div className="rating-card">
        <h1>Rating & Feedback</h1>
        <p>Please rate your experience below</p>
        <div className="star-rating">
          {[5, 4, 3, 2, 1].map((star) => (
            <React.Fragment key={star}>
              <input
                type="radio"
                id={`star${star}`}
                name="rating"
                value={star}
                checked={rating === star}
                onChange={handleRatingChange}
              />
              <label htmlFor={`star${star}`} title={`${star} stars`}></label>
            </React.Fragment>
          ))}
          <div className="rating-lablels">
            <span style={{fontWeight: "bold", marginRight: "60px"}}>Very Bad</span> 
            <span style={{fontWeight: "bold", marginLeft: "60px"}}>Very Good</span>
          </div>
        </div>
        <div className="feedback-section">
          <textarea
            className="feedback-input"
            placeholder="Your feedback is valuable to us..."
            value={feedback}
            onChange={handleFeedbackChange}
          ></textarea>
        </div>
        <div className="button-group">
          <button className="btn btn-primary submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="btn btn-secondary home-btn" onClick={handleHomeClick}>Home</button>
        </div>
      </div>
    </div>
  );
}

export default Rating;
