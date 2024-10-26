import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import koi_default from "../../assets/img/koi_default.jpg";
import { addKoiToAppointmentAPI, createKoiAPI, fetchKoiByKoiIdAPI, fetchPrescriptionByAppointmentIdAPI, fetchTreatmentByIdAPI, updateKoiInformationAPI, updateKoiTreatmentAPI } from "../../apis";
import { toast } from "react-toastify";
import "./KoiDetail.css";
import { fishSpecies } from "../../utils/constants";
import { useSelector } from "react-redux";
import { Image, Upload } from "antd";
import Modal from "../../components/Modal/Modal";
import MedicineListPage from "../MedicineListPage/MedicineListPage";
import PrescriptionDetail from "../PrescriptionDetail/PrescriptionDetail";
import ImgCrop from "antd-img-crop";
// import PrescriptionDetail from "../PrescriptionDetail/PrescriptionDetail";

function KoiDetail({ isCreate, cusId, isUpdate, onClose, onUpdate, isAppointment, customerId, isBooking }) {
  const [koiData, setKoiData] = useState({
    breed: "",
    age: "",
    length: "",
    weight: "",
    healthStatus: "",
    note: "",
    image: null,
    koiId: null,
    customerId: customerId,
  });
  const [treatmentData, setTreatmentData] = useState({
    koiTreatmentId: null,
    koiId: null,
    appointmentId: null,
    healthIssue: null,
    treatment: null,
    prescription_id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const treatmentId = searchParams.get("treatmentId");
  const [image, setImage] = useState(null);
  const { appointmentId } = useParams();
  const role = useSelector((state) => state.user.role);
  const [prescriptions, setPrescriptions] = useState([]);
  const { koiId } = useParams();
  const navigate = useNavigate();
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [isListPrescriptionOpen, setIsListPrescriptionOpen] = useState(false);

  const handleOpenListPrescription = () => {
    setIsListPrescriptionOpen(true);
  };

  const handleCloseListPrescrition = () => {
    setIsListPrescriptionOpen(false);
  };

  const handleOpenMedicineModal = () => {
    setIsMedicineModalOpen(true);
  };

  const handleCloseMedicineModal = () => {
    setIsMedicineModalOpen(false);
  };

  const handleViewDetails = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    setSelectedPrescriptionId(null);
  };

  const handleChangeTreatmentData = (name, value) => {
    setTreatmentData({
      ...treatmentData,
      [name]: value === "None" ? null : value,
    });
  };
  const handleUploadImage = (file) => {
    setImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAppointment) {
      if (isCreate) {//bác sĩ thêm cá koi vào cuộc hẹn
        const response = await addKoiToAppointmentAPI(appointmentId, { ...koiData, customerId: cusId }, image)
        toast.success(response.data.message);
        onUpdate(); // Call the callback function reload list Koi
        onClose();
      }
      if (isUpdate) {   // bác sĩ cập nhật thông tin cá koi
        await updateKoiInformationAPI(koiData.koiId, koiData, image);
        const updateTreatment = await updateKoiTreatmentAPI(treatmentData)
        toast.success(updateTreatment.data.message);
        setIsEditing(false);
      }
    } else {
      if (isCreate) {
        const response = await createKoiAPI(koiData, image);
        toast.success(response.data.message);
        onUpdate(); // Call the callback function reload list Koi
        onClose();
      }
      if (isUpdate) {
        // khách hàng cập nhật thông tin cá koi
        await updateKoiInformationAPI(koiData.koiId, koiData, image);
        setIsEditing(false);
      }
    }
  };

  const handleUpdateButton = () => {
    setIsEditing(!isEditing); // Bật chế độ chỉnh sửa khi nhấn "Update"
  };
  const fetchPrescriptions = async () => {
    const response = await fetchPrescriptionByAppointmentIdAPI(appointmentId);
    setPrescriptions(response.data);
  };
  const fetchTreatment = async () => {
    const response = await fetchTreatmentByIdAPI(treatmentId);
    setTreatmentData({ ...treatmentData, ...response.data });
    setKoiData(response.data.koi);
  };
  const fetchKoiByKoiId = async () => {
    const response = await fetchKoiByKoiIdAPI(koiId);
    setKoiData(response.data);
  };
  useEffect(() => {
    if (!isCreate) {
      // nếu không trong chế độ create thì mới lấy dữ liệu cá koi
      if (isAppointment) {
        fetchTreatment(); // lấy dữ liệu treatment
        fetchPrescriptions(); // lấy dữ liệu đơn thuốc
      } else {
        fetchKoiByKoiId();
      }
    }
  }, [koiId, isCreate, customerId, appointmentId, treatmentId]);

  return (
    <div className="col-9 mx-auto">
      <h1>{isCreate ? "Create New Koi" : "Update Koi Information"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="col-12-md row my-5">
          <div className="form-group col-md-7">
            <label>Breed:</label>
            <select
              className="form-select"
              value={koiData.breed}
              onChange={(e) =>
                setKoiData({ ...koiData, breed: e.target.value })
              }
              disabled={!isEditing && !isCreate}
            >
              <option value="" disabled>
                Select breed
              </option>
              {fishSpecies.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
            <div className="form-group mt-3">
              <label>Notes</label>
              <textarea
                value={koiData.note}
                onChange={(e) =>
                  setKoiData({ ...koiData, note: e.target.value })
                }
                placeholder="Enter notes"
                disabled={!isEditing && !isCreate}
              />
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <Image width={250} className="w-100 koi-profile-image rounded-3" src={(image ? URL.createObjectURL(image) : koiData.image) ||
              koi_default} alt="Koi" />
            {(isEditing || isCreate) && ( // Only show the upload input if isEditing is true
              <div className="form-group mt-3 text-center">
                <button className="custom-file-upload" type="button">
                  <ImgCrop rotationSlider>
                    <Upload
                      listType="picture" // Giữ nguyên để chỉ tải lên một bức ảnh
                      beforeUpload={(file) => {
                        handleUploadImage(file); // Gọi handleImageChange với tệp
                        return false; // Ngăn không cho gửi yêu cầu tải lên
                      }}
                      disabled={!isEditing && !isCreate}
                      showUploadList={false} // Ẩn danh sách tải lên
                    >
                      <div className="custom-file-upload p-0"> <i className="fa-solid fa-upload"></i> Upload</div>
                    </Upload>
                  </ImgCrop>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="form-group d-flex justify-content-between gap-3">
          <div>
            <label>Age (years)</label>
            <input
              type="number"
              value={koiData.age}
              onChange={(e) => {
                setKoiData({ ...koiData, age: e.target.value });
              }}
              placeholder="Enter age"
              disabled={!isEditing && !isCreate}
            />
          </div>
          <div>
            <label>Length (cm)</label>
            <input
              type="number"
              step="0.1"
              value={koiData.length}
              onChange={(e) =>
                setKoiData({ ...koiData, length: e.target.value })
              }
              placeholder="Enter length"
              disabled={!isEditing && !isCreate}
            />
          </div>
          <div>
            <label>Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={koiData.weight}
              onChange={(e) =>
                setKoiData({ ...koiData, weight: e.target.value })
              }
              placeholder="Enter weight"
              disabled={!isEditing && !isCreate}
            />
          </div>
        </div>

        {isAppointment ? (
          <div className="gap-6 row">
            <div className="form-group col-md-6">
              <label>Health Issue</label>
              <textarea
                name="healthIssue"
                value={treatmentData.healthIssue}
                onChange={(e) =>
                  handleChangeTreatmentData(e.target.name, e.target.value)
                }
                placeholder="Enter treatment"
                disabled={!isEditing && !isCreate}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Treatment</label>
              <textarea
                value={treatmentData.treatment}
                name="treatment"
                onChange={(e) =>
                  handleChangeTreatmentData(e.target.name, e.target.value)
                }
                placeholder="Enter treatment"
                disabled={(!isEditing && !isCreate) || role === "CUSTOMER"}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Prescription</label>
              <select
                className="form-select"
                value={treatmentData.prescription_id || "None"}
                name="prescription_id"
                onChange={(e) =>
                  handleChangeTreatmentData(e.target.name, e.target.value)
                }
                disabled={(!isEditing && !isCreate) || role === "CUSTOMER"}
              >
                <option value="None">None</option>
                {prescriptions.map((prescription) => (
                  <option key={prescription.id} value={prescription.id}>
                    {prescription.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6 d-flex align-items-end gap-3 justify-content-end">
              {role === "VETERINARIAN" && <button type="button" className="btn btn-primary" onClick={handleOpenMedicineModal}>Add Prescription</button>}
              <button type="button" className="btn btn-primary" onClick={handleOpenListPrescription}>View Prescriptions</button>
            </div>
          </div>
        ) : null}

        <div className="button-group">
          {isCreate && (isAppointment || isBooking) ? (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Back
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          )}

          {isEditing && isUpdate && !isCreate ? (
            <div className=" d-flex gap-2">
              <button type="button" className="btn btn-secondary" onClick={handleUpdateButton}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          ) : isCreate ? (
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          ) : null}
          {!isEditing && isUpdate ? (
            <button type="button" className="btn btn-primary" onClick={handleUpdateButton}>
              Update
            </button>
          ) : null}
        </div>
      </form>

      <Modal isOpen={isMedicineModalOpen} onClose={handleCloseMedicineModal}>
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
        onClose={handleClosePrescriptionModal}
      >
        {selectedPrescriptionId && (
          <PrescriptionDetail prescriptionId={selectedPrescriptionId} />
        )}
      </Modal>

      <Modal
        isOpen={isListPrescriptionOpen}
        onClose={handleCloseListPrescrition}
      >
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
                    onClick={() => {
                      handleViewDetails(prescription.id);
                      handleCloseListPrescrition();
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default KoiDetail;
