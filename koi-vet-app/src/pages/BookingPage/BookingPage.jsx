import React, { useEffect, useState } from 'react'
import './BookingPage.css'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../components/Loading/Loading'
import { ServiceStep } from '../BookingStep/ServiceStep/ServiceStep'
import { resetBoking, setBookingData, setStep } from '../../store/bookingSlice'
import { useNavigate } from 'react-router-dom'
import VeterinarianStep from '../BookingStep/VeterinarianStep/VeterinarianStep'
import DatePickStep from '../BookingStep/DataPickStep/DatePickStep'
import Payment from '../Payment/Payment'
import InputKoiStep from '../BookingStep/InputKoiStep/InputKoiStep'
import InputPondStep from '../BookingStep/InputPontStep/InputPondStep'
import { SERVICE_FOR } from '../../utils/constants'
import { Stepper, Step, StepLabel } from '@mui/material'; // Thêm import cho Stepper

function BookingPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step = useSelector(state => state.booking.step)
  const totalSteps = 5;
  const [nextTitle, setNextTitle] = useState('Next')
  const [isNextButton, setIsNextButton] = useState(true)
  const date = useSelector(state => state.booking.bookingData.date)
  const startAt = useSelector(state => state.booking.bookingData.startAt)
  const endAt = useSelector(state => state.booking.bookingData.endAt)
  const type = useSelector(state => state.booking.bookingData.type)
  const serviceFor = useSelector(state => state.booking.bookingData.serviceFor)
  const selected = useSelector(state => state.booking.bookingData.selected)
  // ... existing code ...
  useEffect(() => {
    // Handle browser back button
    const handlePopState = (event) => {
      const confirmation = window.confirm("Your booking process is not complete. Are you sure you want to leave?");
      if (!confirmation) {
        event.preventDefault(); // Cancel the back action
        window.history.pushState(null, null); // Reset the history to stay on the page
      } else {
        // If confirmed, allow the back action
        window.history.back(); // Go back in history
      }
    };

    window.history.pushState(null, null); // Add a dummy state to intercept back
    window.addEventListener('popstate', handlePopState);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNextStepButton = () => {
    switch (step) {
      case 1: {
        if (serviceFor === SERVICE_FOR.ONLINE) {
          dispatch(setStep(3))
        } else {
          dispatch(setStep(2))
        }
        break;
      }
      case 2:
        dispatch(setStep(3))
        break
      case 3:
        if (serviceFor === SERVICE_FOR.KOI) {
          dispatch(setStep(4))
        }
        else if (serviceFor === SERVICE_FOR.POND) {
          dispatch(setStep(5))
        }
        else if (serviceFor === SERVICE_FOR.ONLINE) {
          dispatch(setStep(6))
        }
        break
      case 4:
        dispatch(setStep(6))
        break
      case 5:
        dispatch(setStep(6))
        break
      default:
        break
    }
  }

  const handleBackButton = () => {
    switch (step) {
      case 1:
        dispatch(resetBoking())
        navigate('/')
        break
      case 2:
        dispatch(
          setBookingData({
            serviceId: null,
            serviceFor: null,
            selected: []
          })
        )
        dispatch(setStep(1))
        break
      case 3:
        dispatch(setBookingData({
          selectedDate: null,
          vetId: "SKIP",
          startAt: null,
          endAt: null,
          date: null
        }))
        dispatch(setStep(2))
        break
      case 4:
        dispatch(setStep(3))
        break
      case 5:
        dispatch(setStep(3))
        break
      case 6:
        if (serviceFor === SERVICE_FOR.KOI) {
          dispatch(setStep(4))
        }
        else if (serviceFor === SERVICE_FOR.POND) {
          dispatch(setStep(5))
        }
        else if (serviceFor === SERVICE_FOR.ONLINE) {
          dispatch(setStep(3))
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (selected.length === 0) {
      setNextTitle('Skip')
    } else {
      setNextTitle('Next')
    }
  }, [selected])

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <ServiceStep />;
      case 2:
        return <VeterinarianStep />;
      case 3:
        return <DatePickStep />;
      case 4:
        return <InputKoiStep />;
      case 5:
        return <InputPondStep />;
      case 6:
        return <Payment />;
      default:
        return <Loading />;
    }
  };

  useEffect(() => {
    switch (step) {
      case 0:
        navigate("/");
        break;
      case 1:
        setIsNextButton(false)
        break;
      case 2:
        setIsNextButton(true)
        setNextTitle('Skip')
        break;
      case 3:
        setIsNextButton(false)
        if (date && startAt && endAt) {
          setNextTitle('Next')
        }
        break;
      case 4:
        setIsNextButton(true)
        break;
      case 5:
        setIsNextButton(true)
        break;
      case 6:
        setIsNextButton(false)
        break;
      default:
        break;
    }
  }, [step]);

  const steps = [
    'Select service',
    'Select veterinarian',
    'Select date',
    serviceFor === SERVICE_FOR.KOI ? 'Enter Koi information' : serviceFor === SERVICE_FOR.POND ? 'Enter Pond information' : 'Enter Koi/Pond information',
    'Payment'
  ];

  const stepsOnline = [
    'Select service',
    'Select veterinarian',
    'Select date',
    'Payment'
  ]



  return (
    <div className="container booking-container">
      <h2 className="text-center booking-title mb-3">Appoinment Booking</h2>
      <Stepper activeStep={step - 1} alternativeLabel>
        {type === "ONLINE" ? stepsOnline.map((label, index) => (
          <Step key={index} > {/* Màu nền và màu chữ tùy chỉnh */}
            <StepLabel >{label}</StepLabel> {/* Màu chữ tùy chỉnh */}
          </Step>
        )) : steps.map((label, index) => (
          <Step key={index} > {/* Màu nền và màu chữ tùy chỉnh */}
            <StepLabel >{label}</StepLabel> {/* Màu chữ tùy chỉnh */}
          </Step>
        ))}
      </Stepper>
      <div className="mt-5">
        {renderStepComponent()}
      </div>
      <div className="row">
        <div className="row d-flex justify-content-between">
          <div className="col-md-1">
            <button className="btn btn-primary " onClick={() => handleBackButton()}>Back</button>
          </div>

          <div className="col-md-1">
            {isNextButton ?
              <button className="btn btn-primary" onClick={() => handleNextStepButton()}>{nextTitle}</button>
              : null
            }
            {
              step === 3 && date && startAt && endAt ?
                <button className="btn btn-primary" onClick={() => handleNextStepButton()}>Next</button>
                : null
            }
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingPage;
