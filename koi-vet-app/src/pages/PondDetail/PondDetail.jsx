import React, { useState, useEffect } from "react";
import "./PondDetail.css";
import pond_default from "../../assets/img/pond_default.jpg";
import {
  fetchPondByPondIdAPI,
  updatePondInformationAPI,
  addPondToAppointmentAPI,
  updatePondTreatmentAPI,
  createPondAPI,
  fetchTreatmentByIdAPI,
  fetchPrescriptionByAppointmentIdAPI,
} from "../../apis";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Modal from "../../components/Modal/Modal";
import MedicineListPage from "../MedicineListPage/MedicineListPage";
import PrescriptionDetail from "../PrescriptionDetail/PrescriptionDetail";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";



const PondDetail = ({ isCreate, isUpdate, onClose, onUpdate, isAppointment, cusId, isBooking }) => {
  const [pondData, setPondData] = useState({
    pondId: "",
    status: "",
    depth: 0,
    perimeter: 0,
    temperature: 0,
    notes: "",
    image: null,
    waterQuality: "",
    filterSystem: "",
    customerId: cusId,
  });
  const [image, setImage] = useState(null);
  const [treatmentData, setTreatmentData] = useState({
    pondTreatmentId: null,
    pondId: null,
    appointmentId: null,
    healthIssue: null,
    treatment: null,
    prescription_id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const treatmentId = searchParams.get("treatmentId");
  const [prescriptions, setPrescriptions] = useState([]);
  const role = useSelector((state) => state?.user?.role);
  const { pondId, appointmentId } = useParams();
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

  const handleUploadImage = (file) => {
    setImage(file);
  };
  const fetchPrescriptions = async () => {
    const response = await fetchPrescriptionByAppointmentIdAPI(appointmentId);
    setPrescriptions(response.data);
  };
  const fetchTreatment = async () => {
    const response = await fetchTreatmentByIdAPI(treatmentId);
    setTreatmentData({ ...treatmentData, ...response.data });
    setPondData(response.data.pond);
  };
  const fetchPondByPondId = async () => {
    const response = await fetchPondByPondIdAPI(pondId);
    setPondData(response.data);
  };
  useEffect(() => {
    if (!isCreate) {
      // nếu không trong chế độ create thì mới lấy dữ liệu cá koi
      if (isAppointment) {
        fetchTreatment(); // lấy dữ liệu treatment
        fetchPrescriptions(); // lấy dữ liệu đơn thuốc
      } else {
        fetchPondByPondId(); // lấy dữ liệu hồ cá
      }
    }
  }, [pondId, isCreate, cusId, appointmentId, treatmentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPondData((prevData) => ({
      ...prevData,
      [name]:
        name === "depth" || name === "perimeter" || name === "temperature"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleUpdateButton = () => {
    setIsEditing(!isEditing); // Bật chế độ chỉnh sửa khi nhấn "Update"
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAppointment) {
      if (isCreate) {//bác sĩ thêm cá pond vào cuộc hẹn
        const response = await addPondToAppointmentAPI(appointmentId, { ...pondData, customerId: cusId }, image)
        toast.success(response.data.message);
        onUpdate(); // Call the callback function reload list Pond
        onClose();
      }
      if (isUpdate) {   // bác sĩ cập nhật thông tin cá pond
        await updatePondInformationAPI(pondData.pondId, pondData, image);
        const updateTreatment = await updatePondTreatmentAPI(treatmentData)
        toast.success(updateTreatment.data.message);
        setIsEditing(false);
      }
    } else {
      if (isCreate) {
        const response = await createPondAPI(pondData, image);
        toast.success(response.data.message);
        onUpdate(); // Call the callback function reload list Pond
        onClose();
      }
      if (isUpdate) {
        setIsEditing(false)
        const response = await updatePondInformationAPI(pondData.pondId, pondData, image); // khách hàng cập nhật thông tin hồ cá
        toast.success(response.data.message);
      }
    }
  };
  const handleChangeTreatmentData = (name, value) => {
    setTreatmentData({
      ...treatmentData,
      [name]: value === "None" ? null : value,
    });
  };

  const renderField = (label, value, name) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={
          name === "depth" || name === "perimeter" || name === "temperature"
            ? "number"
            : "text"
        }
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        disabled={!isEditing && !isCreate}
      />
    </div>
  );

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div className="col-md-9 mx-auto row">
        <h1 className="mb-4 text-center">{isCreate ? "Add new pond" : "Pond Detail"}</h1>
        <div className="col-md-4 ">
          {renderField("Depth (m)", pondData.depth, "depth")}
          {renderField("Perimeter (m)", pondData.perimeter, "perimeter")}
          <div className="col-md-12">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea className=" form-control pb-3" id="notes" name="notes" value={pondData.notes} onChange={handleInputChange} disabled={!isEditing && !isCreate}></textarea>
          </div>
        </div>
        <div className="col-md-1"> </div>
        <div className="col-md-7 text-center">
          <label className="form-label text-start">Pond Image</label>
          <img src={image ? URL.createObjectURL(image) : pondData.image || pond_default} alt="Pond" className=" w-100 koi-profile-image rounded-3" />
          {(isEditing || isCreate) && ( // Only show the upload input if isEditing is true
              <div className="form-group mt-3 text-center">
                <button className="custom-file-upload" type="button">
                  <ImgCrop rotationSlider aspect={16 / 9}>
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
        <div className="col-md-6 mt-4">
          {renderField("Filter System", pondData.filterSystem, "filterSystem")}
        </div>
        <div className="col-md-3 mt-4">
          {renderField("Temperature (°C)", pondData.temperature, "temperature")}
        </div>
        <div className="col-md-3 mt-4">
          {renderField("Water Quality", pondData.waterQuality, "waterQuality")}
        </div>
        {isAppointment ?
          < >
            <div className="form-group col-md-6">
              <label>Health Issue</label>
              <textarea
                name="healthIssue"
                value={treatmentData.healthIssue}
                onChange={(e) => handleChangeTreatmentData(e.target.name, e.target.value)}
                placeholder="Enter treatment"
                disabled={!isEditing && !isCreate}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Treatment</label>
              <textarea
                value={treatmentData.treatment}
                name="treatment"
                onChange={(e) => handleChangeTreatmentData(e.target.name, e.target.value)}
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
                onChange={(e) => handleChangeTreatmentData(e.target.name, e.target.value)}
                disabled={(!isEditing && !isCreate) || role === "CUSTOMER"}
              >
                <option value="None">None</option>
                {prescriptions.map(prescription => (
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
          </>
          : null}

        <div className="button-group mt-4">
          {isCreate && (isAppointment || isBooking) ?
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Back
            </button>
            :
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          }


          {isEditing && isUpdate && !isCreate ? (
            <div className=" d-flex gap-2">
              <button type="button" className="btn btn-secondary" onClick={handleUpdateButton}>Cancel</button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>

            </div>
          ) : isCreate ? <button type="submit" className="btn btn-primary">
            Create
          </button> : null}
          {!isEditing && isUpdate ? (
            <button type="button" className="btn btn-primary" onClick={handleUpdateButton}>
              Update
            </button>
          ) : null}
        </div>
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
};

export default PondDetail;
