import React, { useEffect, useState } from "react";
import "./VetProfile.css";
import vet from "../../assets/img/veterinarian.png";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVetByVetIdAPI } from "../../apis";
import Loading from "../../components/Loading/Loading";
import { ROLE } from "../../utils/constants";
import Modal from "antd/es/modal/Modal";
import { Form, Input } from "antd";

function VetProfile() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [vets, setVets] = useState(null);

  const fectchVetProfile = async () => {
    const response = await fetchVetByVetIdAPI(vetId);
    setVets(response?.data);
  };

  const handleSubmit = () => {
    
  };

  useEffect(() => {
    fectchVetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetId]);

  if (!vets) {
    return <Loading />;
  }

  return (
    <>
    <div className="vet-profile-container container">
      <h1 className="vet-profile-title">Veterinarian Profile</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="vet-profile-left">
            <img src={vets.imageVeterinarian} alt="Veterinarian" />
            <h2>{vets.user?.fullName}</h2>
          </div>
          <br/>
          {ROLE !== "CUSTOMER" && (
          <div className="vet-profile-left">
              <p>Phone: {vets.phone}</p>
              <p>Email: {vets.user?.email}</p>
              <p>Google meet link: {vets.googleMeet}</p>
            </div>
          )}
            <button
              className="vet-profile-previous mt-5" style={{marginRight: "10px"}}
            onClick={() => navigate(-1)}
          >
            Previous Step
          </button>
          <button className="vet-profile-edit mt-5" onClick={() => setOpen(true)}>Edit</button>
        </div>

        <div className="col-md-6">
          <div className="vet-profile-right">
            <h5>User name: {vets.user?.username}</h5>
            <span>{vets.description}</span>
          </div>
        </div>
      </div>
    </div>
    
    <Modal open={open} onCancel={() => setOpen(false)}>
      <p>Information Veterinarian</p>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
}

export default VetProfile;
