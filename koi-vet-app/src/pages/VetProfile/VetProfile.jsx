import React, { useEffect, useState } from "react";
import "./VetProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVetByVetIdAPI, updateDescriptionByVetIdAPI } from "../../apis";
import Loading from "../../components/Loading/Loading";
import { useSelector } from 'react-redux';
import Modal from "antd/es/modal/Modal";
import { Form } from "antd";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

function VetProfile() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [vets, setVets] = useState(null);
  const role = useSelector(state => state.user.role);

  const fectchVetProfile = async () => {

    const response = await fetchVetByVetIdAPI(vetId);
    setVets(response?.data);
  };

  const handleSubmit = async () => {
    await updateDescriptionByVetIdAPI(vetId, {description});
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  }

  const handleOk = () => {
    handleSubmit();
  }

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
          {role !== "CUSTOMER" && (
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
          {role !== "CUSTOMER" && (
          <button className="vet-profile-edit mt-5" onClick={handleOpen}>Edit</button>
          )}
        </div>

        <div className="col-md-6">
          <div className="vet-profile-right">
            <h5>User name: {vets.user?.username}</h5>
            <div 
              className="service-description" 
              dangerouslySetInnerHTML={{ __html: vets.description }}
            />
          </div>
        </div>
      </div>
    </div>
    
    <Modal open={open} onCancel={handleCancel} onOk={handleOk}>
      <p>Information Veterinarian</p>
      <Form form={form} onFinish={handleSubmit}>
      <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description",
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                value={description} 
                onChange={setDescription}
              />
            </Form.Item>
      </Form>
    </Modal>
    </>
  );
}

export default VetProfile;
