import React, { useEffect, useState } from 'react';
import Koi from '../../components/Koi/Koi';
import Modal from '../../components/Modal/Modal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import KoiDetail from '../KoiDetail/KoiDetail';
import { fetchPrescriptionByAppointmentIdAPI } from '../../apis';
import MedicineListPage from '../MedicineListPage/MedicineListPage';
import PrescriptionDetail from '../PrescriptionDetail/PrescriptionDetail'; // Import PrescriptionDetail
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const KoiTreatmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [koiUpdateTrigger, setKoiUpdateTrigger] = useState(0);
  const { appointmentId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('customerId');
  const role = useSelector(state => state.user.role);
  console.log(role)
  const navigate = useNavigate();
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);  // Lưu Prescription ID được chọn
  //open modal for when click add new koi BTN

  const handlePrescriptionCreated = (newPrescription) => {
    setPrescriptions((prev) => [...prev, newPrescription]);
  };

  const handleAddNewKoi = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //update trigger for koi list
  const handleKoiUpdate = () => {
    setKoiUpdateTrigger(prev => prev + 1);
  };
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await fetchPrescriptionByAppointmentIdAPI(appointmentId)
        setPrescriptions(response.data);
      } catch (error) {
        if(error.response.status !== 404) {
          setPrescriptions([]);
          toast.error(error.response.data.message);
        }
      }
    }
    fetchPrescription()
  }, [appointmentId, koiUpdateTrigger])



  const handleOpenMedicineModal = () => {
    setIsMedicineModalOpen(true);
  }

  const handleCloseMedicineModal = () => {
    setIsMedicineModalOpen(false);
  }

   const handleViewDetails = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    setSelectedPrescriptionId(null);
  };


  return (
    <div className="container mt-4">
      <h3 className="mb-4">Koi in this appointment</h3>
      {/* Existing Koi Table */}
      <Koi
        isVeterinarian={true}
        isBooking={false} // đây không phải là booking mà là appointment
        isAppointment={true} // đây là appointment
        appointmentId={appointmentId}
        title={"Koi in this appointment"}
        prescriptions={prescriptions}
        updateTrigger={koiUpdateTrigger} //trigger update koi list
        onUpdateTreatment={handleKoiUpdate}
      />


      {/* Add New Koi Button */}
      {role !== "CUSTOMER" ?
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => handleAddNewKoi()}>
          Add New Koi
        </button>
      </div> : null}

      {/* Modal for add koi to Appoinment */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <KoiDetail
          cusId={customerId}
          isCreate={true}
          isBooking={false}
          isAppointment={true}
          appointmentId={appointmentId}
          onClose={handleCloseModal}
          onUpdate={handleKoiUpdate}
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
                <th >Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.length === 0 ?
                <tr>
                  <td colSpan="3" className="text-center">No prescription yet</td>
                </tr>
                : null}
              {/* Chạy vòng for ở đây */}
              {prescriptions.map(prescription => (
                <tr key={prescription.id}>
                  <td>{prescription.name}</td>
                  <td>{prescription.note}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleViewDetails(prescription.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {role !== "CUSTOMER" ?
            <button className="btn btn-primary" onClick={handleOpenMedicineModal}>Add Prescription</button>
            : null}

          <Modal isOpen={isMedicineModalOpen} onClose={handleCloseMedicineModal}>
            <MedicineListPage
              appointmentId={appointmentId}
              onPrescriptionCreated={() => {
                handleCloseMedicineModal();
                handleKoiUpdate()
                // Có thể thêm logic để refresh danh sách prescription
              }}
              onClick={handlePrescriptionCreated}
            />
          </Modal>

          <Modal isOpen={isPrescriptionModalOpen} onClose={handleClosePrescriptionModal}>
            {selectedPrescriptionId && (
              <PrescriptionDetail
                prescriptionId={selectedPrescriptionId} />
            )}
          </Modal>

        </div>
      </section>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default KoiTreatmentPage;
