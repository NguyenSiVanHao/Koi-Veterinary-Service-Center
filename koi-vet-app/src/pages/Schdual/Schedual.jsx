import React, { useEffect, useState } from 'react'
import "./Schedual.css"
import { createScheduleAPI, fetchAppointmentByVetIdAndDateAPI, fetchSchedualByVetIdAPI, fetchVetsAPI } from '../../apis'
import { toast } from 'react-toastify'
import { Switch } from 'antd'
import AdminHeader from '../../components/AdminHeader/AdminHeader'
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'
import PreLoader from '../../components/Preloader/Preloader'
import Loading from '../../components/Loading/Loading'
import { useSelector } from 'react-redux'
const Schedual = () => {
    const [selectedVetId, setSelectedVetId] = useState(null)
    const [veterinarians, setVeterinarians] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [appointments, setAppointments] = useState([])
    const [pickedDay, setPickedDay] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const role = useSelector(state => state.user.role)
    const vetId = useSelector(state => state?.user?.veterinarian?.vetId)
    const [selectedDate, setSelectedDate] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const navigate = useNavigate()
    const [schedules, setSchedules] = useState([])
    const [selectDateTrigger, setSelectDateTrigger] = useState(0)
    const handleViewAppointment = (appointmentId) => {
        navigate(`/admin/appointment/${appointmentId}`)
    }
    const handleChangeMode = () => {
        setPickedDay(null)
        setSelectedDate([])
        setAppointments([])
        setIsEditMode(!isEditMode)
    }
    const handleDateClick = (date) => {
        if (isEditMode) {
            if (selectedDate.includes(date)) {
                setSelectedDate(selectedDate.filter(item => item !== date)) // xóa ngày đã chọn
            } else if (schedules.includes(date)) {
                return;
            } else {
                setSelectedDate([...selectedDate, date]) // thêm ngày đã chọn
            }
            console.log(selectedDate)
        } else {
            setPickedDay(date)
        }
    }
    useEffect(() => {
        if (pickedDay) {
            setSelectedDate([pickedDay])
        }
    }, [pickedDay])
    const fetchSchedual = async () => {
        await setSelectedDate([])
        await setSchedules([])
        const response = await fetchSchedualByVetIdAPI(selectedVetId)
        response.data.forEach(item => {
            setSchedules(prev => [...prev, item.date])
        });
        console.log(schedules)
    }
    // Lấy ngày tháng theo định dạng yyyy-MM-dd
    const getLocalDateString = (date) => {
        const year = new Date(date).getFullYear();
        const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0'); // Adjust for zero-based month
        const day = new Date(date).getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatMonth = (date) => {
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    const handleChangeSelectedVet = async (value) => {
        setPickedDay(null)
        setSelectedVetId(value)
    }
    const handlePreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };
    useEffect(() => {
        if (selectedVetId) {
            fetchSchedual()
        }
    }, [selectedVetId, selectDateTrigger])
    const getVeterinarian = async () => {
        const response = await fetchVetsAPI()
        setIsLoading(false)
        setVeterinarians(response.data)
    }
    const handleSubmit = async () => {
        const response = await createScheduleAPI(
            {
                vet_id: selectedVetId,
                dates: selectedDate
            }
        )
        setSelectDateTrigger(selectDateTrigger + 1)
        toast(response.message)
    }
    useEffect(() => {
        if (role !== "VETERINARIAN") {
            getVeterinarian()
        } else if (role === "VETERINARIAN") {
            setSelectedVetId(vetId)
            setIsLoading(false)
            setPickedDay(getLocalDateString(new Date()))

        }
    }, [])
    const fetchAppointments = async () => {
        try {
            await setAppointments([])
            const response = await fetchAppointmentByVetIdAndDateAPI(selectedVetId, pickedDay)
            if (response.status === 200) {
                setAppointments(response.data)
            } else if (response.status === 404) {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("There is no appointment for this day")
        }
    }
    useEffect(() => {
        if (selectedVetId && pickedDay) {
            fetchAppointments()
        }
    }, [selectedVetId, pickedDay])
    const renderDate = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDayOfMonth = new Date(year, month, 1).getDay();
        firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const days = []
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        weekDays.forEach(day => {
            days.push(<div key={`weekday-${day}`} className="weekday">{day}</div>);
        });
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="disabled"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            if (day < 10) {
                day = `0${day}`
            }
            const date = `${year}-${month + 1}-${day}`;
            const isSelected = selectedDate.includes(date); // check xem ngày đó đã đc select chưa
            const isToday = schedules.includes(date); // check xem ngày đó đã có lịch chưa
            const isAvailable = selectedVetId && new Date(date) >= new Date(new Date().toDateString());
            days.push(
                <div
                    key={day}
                    className={`${isAvailable ? 'day' : 'disabled'} ${isToday && !isSelected ? 'current-day' : ''} ${isSelected ? 'chooosed-day' : ''}`}
                    onClick={() => isAvailable ? handleDateClick(date) : null}
                >
                    {day}

                </div>
            );
        }
        return days
    }
    if (isLoading) return <PreLoader />
    return (
        <div className="container text-start">
            <AdminHeader title={"Veterinarian Schedual"} />
            {role !== "VETERINARIAN" && <label htmlFor="select-veterinarian">Select Veterinarian</label>}

            {role !== "VETERINARIAN" &&
                <div className='d-flex flex-row gap-5 align-items-center'>

                    <Select
                        className="w-50"
                        options={
                            veterinarians.map((vet) => ({
                                value: vet.vetId,
                                label: `Name: ${vet.user.fullName} | username: ${vet.user.username}`
                            }))
                        }
                        placeholder="Select Veterinarian"
                        isSearchable={true} // Kích hoạt tính năng search
                        onChange={(selectedOption) => handleChangeSelectedVet(selectedOption.value)}
                    />
                    <label htmlFor="select-veterinarian">Edit mode:</label>
                    <Switch checkedChildren="Edit" unCheckedChildren="View" checked={isEditMode} onChange={handleChangeMode} />
                </div>}
            <div className='d-flex flex-row gap-5'>
                <div className="calendar-container mt-5 mx-0 d-flex flex-row gap-5 justify-content-center">
                    {/* Header với nút điều hướng tháng */}
                    <div className='d-flex flex-column text-center align-items-center justify-content-center gap-5'>
                        <div className="calendar-header">
                            <button onClick={handlePreviousMonth}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left-square-fill previous-month-btn" viewBox="0 0 16 16">
                                    <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1" />
                                </svg>
                            </button>
                            <h2>{formatMonth(currentDate)}</h2>
                            <button onClick={handleNextMonth}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-square-fill next-month-btn" viewBox="0 0 16 16">
                                    <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1" />
                                </svg>
                            </button>
                        </div>
                        {/* Lưới các ngày trong tháng */}
                        <div className="days-grid">
                            {renderDate()}
                        </div>
                        {isEditMode && <button className='btn btn-primary' onClick={handleSubmit} disabled={selectedDate.length === 0}>Add Selected Schedule</button>}
                    </div>
                </div>
                <div className='d-flex flex-column gap-5 mt-5 calendar-container'>
                    <h3>Appointment List  {pickedDay ? `for ${pickedDay}` : null}</h3>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr>
                                    <td>{appointment.code}</td>
                                    <td>{appointment.appointmentDate}</td>
                                    <td>{appointment.startTime}</td>
                                    <td>{appointment.endTime}</td>
                                    <td className='text-center'>
                                        <button className='btn btn-primary' onClick={() => handleViewAppointment(appointment.appointmentId)}>View</button>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && selectedDate.length !== 0 && pickedDay && <tr><td colSpan="5" className='text-center'>No appointment</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    )
}

export default Schedual