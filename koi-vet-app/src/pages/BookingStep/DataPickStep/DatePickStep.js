import React, { useEffect, useState } from 'react'
import './datepicker.css'
import { fetchScheduleByAppimentTypeAPI } from '../../../apis';
import { useSelector, useDispatch } from 'react-redux';
import { setBookingData } from '../../../store/bookingSlice';

const DatePickStep = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [schedule, setSchedule] = useState([])
  const type = useSelector(state => state.booking.bookingData.type)  
  const vetId = useSelector(state => state.booking.bookingData.vetId)
  const dispatch = useDispatch();
  const bookingData = useSelector(state => state.booking.bookingData);
  // Lấy dữ liệu schedul theo appointmentType và vetId
  useEffect(() => {
    const fetchSchedule = async (type, vetId) => {
      const response = await fetchScheduleByAppimentTypeAPI(type, vetId);
      setSchedule(response.data);
    }
    fetchSchedule(type, vetId);
  }, [type, vetId])
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    // Adjust to make Monday the first day of the week
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];

    // Add weekday headers
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    weekDays.forEach(day => {
      days.push(<div key={`weekday-${day}`} className="weekday">{day}</div>);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="disabled"></div>);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      console.log(date)
      const dateString = date.toISOString().split('T')[0]; // Lấy chuỗi ngày tháng năm
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isAvailable = schedule.some(item => item.day === dateString);
    
      days.push(
        <div
          key={day}
          className={`
            ${isAvailable ? 'day' : 'disabled'}
            ${isToday ? 'current-day' : ''}
            ${isSelected ? 'chooosed-day' : ''}
          `.trim()}
          onClick={() => isAvailable && handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    resetTime();
  }

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    resetDate();
    resetTime();
  }

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    resetDate();
    resetTime();
  }

  const resetDate = () => {
    setSelectedDate(null);
    dispatch(setBookingData({
      date: null,
    }));
  }
  const resetTime = () => {
    dispatch(setBookingData({
      startAt: null,
      endAt: null,
    }));
  }

  const formatMonth = (date) => {
    return date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
  }

  const handleTimeSlotClick = (startTime, endTime) => {
    dispatch(setBookingData({
      date: selectedDate.toISOString().split('T')[0],
      startAt: startTime,
      endAt: endTime
    }));
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const selectedDayData = schedule.find(item => item.day === selectedDateString);

    if (!selectedDayData) return <p>No available slots for this date.</p>;

    return (
      <div className="slots text-start">
        <h3>Available time slots for {selectedDate.toLocaleDateString('vi-VN')}:</h3>
        {selectedDayData.slots.map((slot, index) => (
          <div
            key={index}
            className={`slot ${bookingData.startAt === slot.startTime && bookingData.endAt === slot.endTime ? 'slot-picked' : ''}`}
            onClick={() => handleTimeSlotClick(slot.startTime, slot.endTime)}
          >
            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
          </div>
        ))}
        <p>Please select a time slot to continue booking</p>
      </div>
    );
  }

  return (
    <div>
      <div className="calendar-container">
        {/* Header với nút điều hướng tháng */}
        <div className="calendar-header">
          <button onClick={handlePreviousMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left-square-fill previous-month-btn" viewBox="0 0 16 16">
              <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
            </svg>
          </button>
          <h2>{formatMonth(currentDate)}</h2>
          <button onClick={handleNextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-square-fill next-month-btn" viewBox="0 0 16 16">
              <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
            </svg>
          </button>
        </div>

        {/* Lưới các ngày trong tháng */}
        <div className="days-grid">
          {renderDays()}
        </div>
        
        <hr />
        {renderTimeSlots()}
      </div>
    </div>
  )
}

export default DatePickStep