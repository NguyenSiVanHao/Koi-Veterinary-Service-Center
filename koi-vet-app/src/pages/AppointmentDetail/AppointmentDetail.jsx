import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cancelAppointmentAPI, fecthServiceByServiceIdAPI, fetchAppointmentByIdAPI, fetchVetForAssignAPI, updateAppointmentAPI } from "../../apis";
import "./AppointmentDetail.css";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { APPOINTMENT_STATUS, BOOKING_TYPE, ROLE, SERVICE_FOR } from "../../utils/constants";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import PreLoader from "../../components/Preloader/Preloader";
import InvoiceList from "../../components/InvoiceList/InvoiceList";
const updateAppointment = async (appointmentData, appointmentId) => {
  try {
    await updateAppointmentAPI(appointmentData, appointmentId);
  } catch (error) {
    console.error("Error updating appointment:", error);
  }
}
function AppointmentDetail() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [vetList, setVetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignVetTrigger, setAssignVetTrigger] = useState(0);
  const [service, setService] = useState({});
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [navigateLink, setNavigateLink] = useState({
    link: null,
    title: null
  });
  const [appointment, setAppointment] = useState({
    "appointmentId": null,
    "appointmentDate": null,
    "createdAt": null,
    "depositedMoney": null,
    "endTime": null,
    "location": null,
    "result": null,
    "startTime": null,
    "status": null,
    "type": null,
    "customerId": null,
    "customerName": null,
    "serviceId": null,
    "serviceName": null,
    "vetId": null
  });
  const [isEditing, setIsEditing] = useState(false);
  const role = useSelector((state) => state.user.role);
  const fetchAppointmentDetail = async (appointmentId) => {
    try {
      const response = await fetchAppointmentByIdAPI(appointmentId);
      setAppointment({ ...appointment, ...response.data });
      if (response.status === 200) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointmentDetail(appointmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  }
  useEffect(() => {
    const fetchVetList = async () => {

      const responseVet = await fetchVetForAssignAPI({
        type: appointment.type,
        serviceId: appointment.serviceId,
        date: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime
      });
      setVetList(responseVet.data);
    }
    if (appointment.type && appointment.serviceId && appointment.appointmentDate && appointment.startTime && appointment.endTime) {
      fetchVetList();
    }
  }, [appointment.type,
  appointment.serviceId,
  appointment.appointmentDate,
  appointment.startTime,
  appointment.endTime]);
  useEffect(() => {
    const fetchService = async () => {
      const responseService = await fecthServiceByServiceIdAPI(appointment.serviceId);
      setService(responseService.data);

    }
    fetchService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.serviceId, role]);
  useEffect(() => {
    switch (service.serviceFor) {
      case SERVICE_FOR.KOI:
        if (role !== ROLE.CUSTOMER) {
          setNavigateLink({
            link: `/admin/koi-treatment/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Koi Information"
          })
        } else {
          setNavigateLink({
            link: `/profile/koi-treatment/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Koi Information"
          })
        }
        break;
      case SERVICE_FOR.POND:
        if (role !== ROLE.CUSTOMER) {
          setNavigateLink({
            link: `/admin/pond-treatment/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Pond Information"
          })
        } else {
          setNavigateLink({
            link: `/profile/pond-treatment/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Pond Information"
          })
        }
        break;
      case SERVICE_FOR.ONLINE:
        if (role !== ROLE.CUSTOMER) {
          setNavigateLink({
            link: `/admin/google-meet/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Google Meet"
          })
        } else {
          setNavigateLink({
            link: `/profile/google-meet/${appointment.appointmentId}?customerId=${appointment.customerId}`,
            title: "Google Meet"
          })
        }
        break;
      default:
        break;
    }
  }, [role, service, assignVetTrigger]);

  const handleAssignVet = (e) => {
    e.preventDefault();
    if (e.target.value !== "SKIP") {
      setAppointment({ ...appointment, vetId: e.target.value, status: APPOINTMENT_STATUS.BOOKING_COMPLETE });
    } else {
      setAppointment({ ...appointment, vetId: null, status: APPOINTMENT_STATUS.CREATED });
    }
    console.log(appointment);
  };
  const handleStartFinish = () => {

    if (appointment.status === APPOINTMENT_STATUS.BOOKING_COMPLETE) {
      Modal.confirm({
        title: 'Start Appointment',
        content: (
          <div>
            <p>Are you sure to start?</p>
          </div>
        ),
        onOk: () => {
          setAppointment({ ...appointment, status: APPOINTMENT_STATUS.PROCESS })
          updateAppointment({ ...appointment, status: APPOINTMENT_STATUS.PROCESS }, appointmentId)
        }
      });
    } else if (appointment.status === APPOINTMENT_STATUS.PROCESS) {
      Modal.confirm({
        title: 'Finish Appointment',
        content: (
          <div>
            <p>Are you sure to finish?</p>
          </div>
        ),
        onOk: () => {
          setAppointment({ ...appointment, status: APPOINTMENT_STATUS.READY_FOR_PAYMENT });
          updateAppointment({ ...appointment, status: APPOINTMENT_STATUS.READY_FOR_PAYMENT }, appointmentId);
        }
      });
    } else if (appointment.status === APPOINTMENT_STATUS.READY_FOR_PAYMENT) {
      navigate(`/admin/checkout/${appointmentId}`);
    }
    setIsEditing(false);
  }
  const handleCancelAppointment = () => {
    Modal.confirm({
      title: 'Cancel Appointment',
      content: (
        <div>
          <p>Are you sure to cancel? This action cannot be undone.</p>
        </div>
      ),
      onOk: async () => {
        const response = await cancelAppointmentAPI(appointmentId);
        if (response.status === 200) {
          fetchAppointmentDetail(appointmentId);
        }
      }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAppointmentAPI(appointment, appointmentId);
      setAssignVetTrigger(assignVetTrigger + 1)
      setIsEditing(false);
      // Optionally, show a success message
    } catch (error) {
      console.error("Error updating appointment:", error);
      // Optionally, show an error message
    }
  };

  // Mapping of status values to display strings
  const statusDisplayMap = {
    [APPOINTMENT_STATUS.CREATED]: "Waiting Confirm",
    [APPOINTMENT_STATUS.BOOKING_COMPLETE]: "Veterinarian Assigned",
    [APPOINTMENT_STATUS.PROCESS]: "Process",
    [APPOINTMENT_STATUS.READY_FOR_PAYMENT]: "Ready For Payment",
    [APPOINTMENT_STATUS.FINISH]: "Completed",
    [APPOINTMENT_STATUS.CANCEL]: "Cancelled"
  };

  const currentDate = new Date();
  const appointmentDate = new Date(appointment.appointmentDate);

  // Set the time of the current date to the start of the day (00:00:00)
  currentDate.setHours(0, 0, 0, 0);

  // Check if the appointment is more than one day away
  const isCancelable = appointmentDate > new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  if (isLoading) return <PreLoader />

  return (
    <>
      <AdminHeader title="Appointment Detail" />

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="appointmentId" className="form-label">
              Appointment Code
            </label>
            <input
              type="text"
              className="form-control"
              id="appointmentId"
              value={appointment.code}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="createDate" className="form-label">
              Created Date
            </label>
            <input
              type="text"
              className="form-control"
              id="createDate"
              name="createDate"
              value={new Date(appointment.createdAt).toLocaleString()}
              disabled
            />
          </div>
        </div>


        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="customerId" className="form-label">
              Customer <i className="fa-solid fa-user" ></i>
            </label>
            <input
              type="text"
              className="form-control"
              id="customerId"
              name="customerId"
              value={appointment.customerName}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <div className="d-flex gap-3">
              <input
                type="text"
                className="form-control"
                id="status"
                name="status"
                value={statusDisplayMap[appointment.status] || appointment.status}
                disabled={true}
              />
              {role !== ROLE.CUSTOMER && (appointment.status === APPOINTMENT_STATUS.BOOKING_COMPLETE || appointment.status === APPOINTMENT_STATUS.PROCESS || appointment.status === APPOINTMENT_STATUS.READY_FOR_PAYMENT) ?
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStartFinish()}
                >
                  {appointment.status === APPOINTMENT_STATUS.BOOKING_COMPLETE ? "Start" : null}
                  {appointment.status === APPOINTMENT_STATUS.PROCESS ? "Finish" : null}
                  {appointment.status === APPOINTMENT_STATUS.READY_FOR_PAYMENT ? "Checkout" : null}

                </button>
                : null}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">

            <label htmlFor="vetId" className="form-label">
              Veterinarian <i className="fa-solid fa-user-doctor" ></i>
            </label>


            <select
              className="form-select"
              id="vetId"
              name="vetId"
              value={appointment.vetId}
              onChange={(e) => handleAssignVet(e)}
              disabled={role === ROLE.VETERINARIAN || !isEditing || (appointment.status !== APPOINTMENT_STATUS.CREATED && appointment.status !== APPOINTMENT_STATUS.BOOKING_COMPLETE)}
            >
              <option value={"SKIP"}>Not assigned</option>
              {appointment.vetId && <option value={appointment.vetId}>
                {appointment.vetName}
              </option>}
              {vetList.map((vet) => (
                <option key={vet.vetId} value={vet.vetId}>
                  {vet.user.fullName}
                </option>
              ))}
            </select>

          </div>
          <div className="col-md-6">
            <label htmlFor="serviceId" className="form-label">
              Service
            </label>
            <input
              type="text"
              className="form-control"
              id="serviceId"
              name="serviceId"
              value={appointment.serviceName}
              onChange={handleInputChange}
              disabled
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="type" className="form-label">
              Appointment Type
            </label>
            <select
              className="form-select"
              id="type"
              name="type"
              value={appointment.type}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value={BOOKING_TYPE.HOME}>Home</option>
              <option value={BOOKING_TYPE.CENTER}>Center</option>
              <option value={BOOKING_TYPE.ONLINE}>Online</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="serviceType" className="form-label">
              Service Type
            </label>
            <input
              type="text"
              className="form-control"
              id="serviceType"
              name="serviceType"
              value={service.serviceFor}
              disabled
            />
          </div>


        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="appointmentDate" className="form-label">
              Appointment Date <i className="fa-solid fa-calendar" ></i>
            </label>
            <input
              type="date"
              className="form-control"
              id="appointmentDate"
              name="appointmentDate"
              value={appointment.appointmentDate}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="startTime" className="form-label">
              Start Time <i className="fa-solid fa-clock" ></i>
            </label>
            <input
              type="time"
              className="form-control"
              id="startTime"
              name="startTime"
              value={appointment.startTime}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="endTime" className="form-label">
              End Time <i className="fa-solid fa-clock" ></i>
            </label>
            <input
              type="time"
              className="form-control"
              id="endTime"
              name="endTime"
              value={appointment.endTime}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="distance" className="form-label ">
              Distance (km) <i className="fa-solid fa-ruler" ></i>
            </label>
            <input
              type="number"
              className="form-control"
              id="distance"
              name="distance"
              value={appointment.distance}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label htmlFor="result" className="form-label">
              Result
            </label>
            <textarea
              className="form-control"
              id="result"
              name="result"
              value={appointment.result}
              onChange={handleInputChange}
              disabled={!isEditing}
            ></textarea>
          </div>
          <div className="col-md-6 mt-3">
            <label htmlFor="location" className="form-label">
              Location <i className="fa-solid fa-location-dot" ></i>
            </label>
            <textarea
              className="form-control"
              id="location"
              name="location"
              value={appointment.location}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* {role === ROLE.CUSTOMER && appointment.status !== APPOINTMENT_STATUS.FINISH && ( */}
          <>
            <div className="d-flex gap-2">
              {role !== ROLE.CUSTOMER && (
                <button
                  type="button"
                  className="btn btn-primary mr-3"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>

              )}
              {role === ROLE.CUSTOMER && appointment.status === APPOINTMENT_STATUS.FINISH && (

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate(`/rating-feedback/${appointmentId}`)}
                >
                  Rating & Feedback
                </button>

              )}
              {
                (appointment.status === APPOINTMENT_STATUS.CREATED || appointment.status === APPOINTMENT_STATUS.BOOKING_COMPLETE) && !isEditing && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleCancelAppointment()}
                  >
                    Cancel Appointment
                  </button>
                )
              }
            </div>


            {!isEditing && <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsInvoiceModalOpen(true)}
            >
              Invoices
            </button>}
          </>

          {isEditing && (
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          )}
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back to All Appointments
        </button>

        {navigateLink.link && (appointment.status !== "FINISH" || appointment.type !== "ONLINE") ?
          <button
            onClick={() => navigate(navigateLink.link)}
            type="button"
            className="btn btn-primary"
          >
            {navigateLink.title}
          </button> : null}

      </div>


      <Modal
        open={isInvoiceModalOpen}
        onCancel={() => setIsInvoiceModalOpen(false)}
      >
        <InvoiceList appointment={appointment} />
      </Modal>
    </>

  );
}

export default AppointmentDetail;