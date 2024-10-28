import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import KoiDetail from "../KoiDetail/KoiDetail";
import { fetchAppointmentByIdAPI, fetchPrescriptionByAppointmentIdAPI } from "../../apis";
import Pond from "../../components/Pond/Pond";
import PondDetail from "../PondDetail/PondDetail";
import MedicineListPage from "../MedicineListPage/MedicineListPage";
import PrescriptionDetail from "../PrescriptionDetail/PrescriptionDetail";
import { useSelector } from "react-redux";
import { APPOINTMENT_STATUS } from "../../utils/constants";

const PondTreatmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pondUpdateTrigger, setPondUpdateTrigger] = useState(0);
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get("customerId");
  const role = useSelector(state => state?.user?.role);
  const navigate = useNavigate();
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null); // Lưu Prescription ID được chọn
  //open modal for when click add new koi BTN
  const handleAddNewPond = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //update trigger for pond list
  const handlePondUpdate = () => {
    setPondUpdateTrigger(prev => prev + 1);
  };
  useEffect(() => {
    const fetchPrescription = async () => {
      const response = await fetchPrescriptionByAppointmentIdAPI(appointmentId);
      setPrescriptions(response.data);
    };
    const fetchAppointment = async () => {
      const response = await fetchAppointmentByIdAPI(appointmentId);
      setAppointment(response.data);
    };
    fetchPrescription();
    fetchAppointment();
  }, [appointmentId]);

  const handleOpenMedicineModal = () => {
    setIsMedicineModalOpen(true);
  };

  const handleCloseMedicineModal = () => {
    setIsMedicineModalOpen(false);
  };

  const handleViewPrescriptionPondDetails = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionPondModal = () => {
    setIsPrescriptionModalOpen(false);
    setSelectedPrescriptionId(null);
  };
  return (
    <div className="container mt-4">
      <h3 className="mb-4">Pond in this appointment</h3>
      {/* Existing Koi Table */}
      <Pond
        isVeterinarian={true}
        isBooking={false} // đây không phải là booking mà là appointment
        isAppointment={true} // đây là appointment
        appointmentId={appointmentId}
        title={"Pond in this appointment"}
        prescriptions={prescriptions}
        updateTrigger={pondUpdateTrigger} //trigger update pond list
        onUpdateTreatment={handlePondUpdate}
      />


      {/* Add New Pond Button */}
      {(appointment?.status === APPOINTMENT_STATUS.PROCESS || appointment?.status === APPOINTMENT_STATUS.BOOKING_COMPLETE) &&
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => handleAddNewPond()}>
            Add New Pond
          </button>
        </div>}

      {/* Modal for PondDetail */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PondDetail
          cusId={customerId}
          isCreate={true}
          isBooking={false}
          isVeterinarian={true}
          isAppointment={true}
          appointmentId={appointmentId}
          onClose={handleCloseModal}
          onUpdate={handlePondUpdate}
        />
      </Modal>
      <br />
      <section className="mb-5">
        <h2 className="h4 font-weight-bold mb-4">PRESCRIPTION</h2>
        <div className="overflow-auto">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>

                <th>Prescription Name </th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Chạy vòng for ở đây */}
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>

                  <td>{prescription.name}</td>
                  <td>{prescription.note}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleViewPrescriptionPondDetails(prescription.id)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointment?.status === APPOINTMENT_STATUS.PROCESS && <button className="btn btn-primary" onClick={handleOpenMedicineModal}>
            Add Prescription
          </button>}
          <Modal
            isOpen={isMedicineModalOpen}
            onClose={handleCloseMedicineModal}
          >
            <MedicineListPage
              appointmentId={appointmentId}
              onPrescriptionCreated={() => {
                handleCloseMedicineModal();
                // Có thể thêm logic để refresh danh sách prescription
              }}
            />
          </Modal>

          <Modal
            isOpen={isPrescriptionModalOpen}
            onClose={handleClosePrescriptionPondModal}
          >
            {selectedPrescriptionId && (
              <PrescriptionDetail prescriptionId={selectedPrescriptionId} />
            )}
          </Modal>
        </div>
      </section>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default PondTreatmentPage;
