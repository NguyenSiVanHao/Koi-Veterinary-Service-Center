import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pond.css';
import { fetchPondsByCustomerIdAPI, fetchPondsByAppointmentIdAPI, fetchPrescriptionByAppointmentIdAPI, updatePondTreatmentAPI, deletePondAPI } from '../../apis';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import pond_default from '../../assets/img/pond_default.jpg'
import { Modal as AntdModal } from 'antd';
import Treatment from '../Treatment/Treatment';
import Modal from '../Modal/Modal';


const Pond = ({ title, selectedPonds, onUpdateTreatment, updateTrigger, isBooking, handleAddPondToBooking, isAppointment, appointmentId }) => {
    const navigate = useNavigate();
    const [pondTreatmentList, setPondTreatmentList] = useState([])
    const customerId = useSelector(state => state?.user?.customer?.customerId)
    const role = useSelector(state => state?.user?.role);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData] = useState({})
    //open modal for when click add treatment
    const [deleteTrigger, setDeleteTrigger] = useState(0);
    const handleDeletePond = async (pondId) => {
        AntdModal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this pond?',
            onOk: async () => {
                const response = await deletePondAPI(pondId)
                toast.success(response.message);
                setDeleteTrigger(prev => prev + 1);
            }
        });
    }
    const handleSubmitTreatment = () => {
        onUpdateTreatment();
        setIsModalOpen(false);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleViewDetail = (pondId, treatmentId) => {
        if (isAppointment) {
            if (role === "CUSTOMER") {
                navigate(`/profile/ponddetail/${appointmentId}?treatmentId=${treatmentId}&appointmentId=${appointmentId}`)
            } else {
                navigate(`/admin/ponddetail/${appointmentId}?treatmentId=${treatmentId}&appointmentId=${appointmentId}`)
            }
        } else {
            navigate(`/profile/pond/${pondId}`)
        }
    }
    useEffect(() => {
        const fetchPonds = async () => {
            try {
                let response;
                if (isAppointment) {
                    response = await fetchPondsByAppointmentIdAPI(appointmentId)
                    setPondTreatmentList(response.data)

                } else {
                    response = await fetchPondsByCustomerIdAPI(customerId);
                    console.log(response.data)
                    const pondList = response.data.map(pondTreatment =>
                    ({
                        pond: pondTreatment,
                    })
                    )
                    setPondTreatmentList(pondList);
                    console.log(pondList);
                }

            } catch (error) {
                console.error('Error fetching pond list:', error);
            }
        };
        const fetchPrescriptions = async () => {
            const response = await fetchPrescriptionByAppointmentIdAPI(appointmentId)
            setPrescriptions(response.data)
        }
        fetchPonds();
        if(isAppointment) {
            fetchPrescriptions();
        }
    }, [customerId, isAppointment, appointmentId, updateTrigger, deleteTrigger]);

    // lưu lại đơn thuốc
    const handleChangePrescription = (treatmentId, prescriptionId, pondId) => {
        const updatePrescriptionId = async () => {
            try {
                const response = await updatePondTreatmentAPI({
                    pondTreatmentId: treatmentId,
                    prescription_id: prescriptionId === "None" ? null : prescriptionId,
                    pondId: pondId,
                });
                toast.success(response.message);

                // Update the local state or data source to reflect the change
                setPondTreatmentList(prevList =>
                    prevList.map(treatment =>
                        treatment.pondTreatmentId === treatmentId
                            ? { ...treatment, prescription_id: prescriptionId === "None" ? null : prescriptionId }
                            : treatment
                    )
                );
                onUpdateTreatment();
            } catch (error) {
                toast.error('Failed to update prescription');
            }
        };
        updatePrescriptionId();
    };
    return (
        <div className="container mt-4">
            <div className="card mb-4">
                <div className="card-header input-info-title text-white">
                    <h5 className="mb-0 text-start">{title}</h5>
                </div>

                {/* option thiết kế 1 */}
                {
                    <div className=" mb-4">

                        <div className="card-body">
                            {pondTreatmentList.map(treatment => {
                                const isSelected = selectedPonds?.includes(treatment?.pond?.pondId);
                                return (
                                    <>

                                        <div key={treatment.pond?.pondId} className="d-flexmb-4 pb-3 border-bottom row align-items-center">
                                            <div className={`col-md-5 mt-2 ${isSelected ? 'table-primary' : ''}`}>
                                                {/* <h4>{"Đây là hồ cá pond của anh tú"}</h4> */}
                                                <p><strong>Depth:</strong> {treatment?.pond?.depth} m</p>
                                                <p><strong>Perimeter:</strong> {treatment?.pond?.perimeter} m</p>
                                                <p><strong>Filter System:</strong> {treatment?.pond?.filterSystem}</p>
                                                <p><strong>Notes:</strong> {treatment?.pond?.notes}</p>
                                                <p><strong>Health Issue:</strong> {treatment?.healthIssue}</p>
                                                <p><strong>Treatment:</strong> {treatment?.treatment}</p>
                                            </div>
                                            <div className="col-md-4">
                                                <img src={treatment?.pond?.image || pond_default} alt={treatment.pond?.name} className="img-fluid mt-3" style={{ width: '300px', height: '200px', objectFit: 'cover' }} />
                                            </div>
                                            <div className="col-md-3">
                                                <div className='row gap-3 d-flex justify-content-center'>
                                                    <div className='d-flex row flex-column align-items-center gap-2'>
                                                        <div className='d-flex gap-3 text-center justify-content-center'>

                                                            <button className="btn btn-sm btn-primary " onClick={() => handleViewDetail(treatment.pond.pondId, treatment?.pondTreatmentId)}>
                                                                View <br />Details
                                                            </button>
                                                            {
                                                                role === "CUSTOMER" && !isAppointment && !isSelected && (
                                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletePond(treatment.pond.pondId)}>
                                                                        Delete
                                                                    </button>
                                                                )
                                                            }
                                                            {isBooking && (
                                                                <button
                                                                    className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-success'}`}
                                                                    onClick={() => handleAddPondToBooking(treatment.pond.pondId)}
                                                                >
                                                                    {isSelected ? 'Remove from Appointment' : 'Add to Appointment'}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {isAppointment &&
                                                            <select
                                                                className="form-select w-120"
                                                                aria-label="Default select example"
                                                                onChange={(e) => handleChangePrescription(treatment?.pondTreatmentId, e.target.value, treatment?.pond?.pondId)}
                                                                value={treatment.prescriptionId || "None"}
                                                                disabled={role === "CUSTOMER"}
                                                            >
                                                                <option value="None">None</option>
                                                                {prescriptions.map(prescription => (
                                                                    <option key={prescription.id} value={prescription.id}>
                                                                        {prescription.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                );
                            })}
                        </div>
                    </div>
                }


            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRequestClose={handleCloseModal}
                children={
                    <Treatment
                        treatment={modalData.treatment}
                        isPond={true}
                        isKoi={false}
                        treatmentId={modalData.pondTreatmentId}
                        onUpdate={handleSubmitTreatment}
                        healthIssue={modalData.healthIssue}
                    />
                }
            />
        </div>
    );
};

export default Pond;
