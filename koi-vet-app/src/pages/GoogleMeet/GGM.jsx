import React, { useEffect, useState } from "react";
import "./GGM.css";
import GGMeet from "../../assets/img/GGMeet.jpg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchAppointmentByIdAPI, fetchVetByVetIdAPI } from "../../apis";
import Loading from "../../components/Loading/Loading";

function GGM() {
    const { appointmentId } = useParams();
    const location = useLocation();
    const [appointment, setAppointment] = useState(null);
    const [veterinarian, setVeterinarian] = useState(null);
    const navigate = useNavigate();
    const customerId = location?.state?.customerId;
    useEffect(() => {
        const fetchAppointment = async () => {
            const response = await fetchAppointmentByIdAPI(appointmentId);

            setAppointment(response.data);
        };
        fetchAppointment();
    }, [appointmentId]);

    useEffect(() => {
        const fetchVeterinarian = async () => {
            const response = await fetchVetByVetIdAPI(appointment.vetId);
            setVeterinarian(response.data);
        };
        fetchVeterinarian();
    }, [appointment]);
    {
        if (veterinarian === null) {
            return <Loading />;
        }
    }
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4">
                <div className="row align-items-center">
                    <div className="col-12 d-flex justify-content-center mb-4">
                        <h2>Online Link</h2>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center mb-4 flex-column">
                        <Link
                            to={veterinarian?.googleMeet}
                            target="_blank"
                            className="mb-4"
                        >
                            <img
                                src={GGMeet}
                                className="img-fluid "
                                style={{ width: "50%" }}
                                alt="Google Meeting"
                            />
                        </Link>

                        <button
                            className="btn btn-primary w-15 col-2 mt-4"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <label className="form-label">User:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.customerName}
                                readonly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Service:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.serviceName}
                                readonly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.appointmentDate}
                                readonly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"> Start Time:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.startTime}
                                readonly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Time:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.endTime}
                                readonly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Doctor:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment?.vetName}
                                readonly
                            />
                        </div>
                        {/* <div className="mb-3">
                            <label className="form-label">Link:</label>
                            <Link
                                to={`https://${veterinarian?.googleMeet}`}
                                className="btn btn-primary"
                            >{`https://${veterinarian?.googleMeet}`}</Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GGM;
