import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccessPage.css';
import { resetBoking } from '../../store/bookingSlice';
import { useDispatch } from 'react-redux';
import Purchase_Success from '../../assets/img/Purchase_Success.png'
const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(()=>{
    dispatch(resetBoking())
  },[dispatch])
  const handleBackToHome = () => {
    navigate('/profile/appointment');
  };

  return (
    <div className="custom-payment-success-container">
      <div className="text-center">
        <img src={Purchase_Success} alt="Payment Successful" />
        <h1 className="fw-bold booking-title">Purchase Successful!</h1>
        <p>Your appointment has been booked successfully.</p>
        <button onClick={handleBackToHome} className="btn btn-primary">
          View my appointment
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;