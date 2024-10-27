import React, { useEffect, useState } from "react";
import "./UserManagementPage.css"
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { createStaffAPI, createVetAPI, fetchAllUsersAPI, updateUserInfoAPI, updateVetByIdAPI } from "../../apis";
import avatar_default from "../../assets/img/profile_default.png"
import { Modal } from "antd";
import StaffForm from "../../components/StaffForm/StaffForm";

const UserManagementPage = () => {
  const [tab, setTab] = useState("STAFF");
  const [staffs, setStaffs] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isAddUser, setIsAddUser] = useState(false);
  const [isModalVeterinarianPopup, setIsModalVeterinarianPopup] = useState(false);
  const [isModalCustomerPopup, setIsModalCustomerPopup] = useState(false);
  const [isModalPopup, setIsModalPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditUser, setIsEditUser] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageChange = (file) => {
    setImage(file);
  }
  const handleOpenModalEditUser = async (userData, isEdit = true) => {
    await setSelectedUser(userData);
    setIsEditUser(isEdit);
    switch (tab) {
      case "STAFF":
        setIsModalPopup(true);
        break;
      case "VETERINARIAN":
        setIsModalVeterinarianPopup(true);
        break;
      case "CUSTOMER":
        setIsModalCustomerPopup(true);
        break;
      default:
        break;
    }
    setIsModalPopup(true);
  }
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalPopup(false);
    setIsModalVeterinarianPopup(false);
    setIsModalCustomerPopup(false);
    setImage(null);
    setIsEditUser(false);
  }
  const fetchUserData = async () => {
    const res = await fetchAllUsersAPI(tab);
    if (tab === "STAFF") {
      setStaffs(res.data);
    } else if (tab === "VETERINARIAN") {
      setVeterinarians(res.data);
    } else if (tab === "CUSTOMER") {
      setCustomers(res.data);
    }
  }
  const handleSubmitCreateUser = async () => {
    switch (tab) {
      case "STAFF":
        await createStaffAPI(selectedUser, image);
        break;
      case "VETERINARIAN":
        await createVetAPI(selectedUser, image);
        break;
      case "CUSTOMER":
        // await createCustomerAPI(selectedUser, image);
        break;
      default:
        break;
    }
  }
  const handleSubmitUpdateUser = async () => {
    switch (tab) {
      case "STAFF":
        await updateUserInfoAPI(selectedUser, image);
        break;
      case "VETERINARIAN":
        await updateVetByIdAPI(selectedUser._id, selectedUser, image);
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    fetchUserData();
  }, [tab])

  return (
    <div className="container">
      <AdminHeader title="User Management" />
      <div className="d-flex justify-content-between align-items-center text-center mb-3">
        <input type="text" placeholder="Search" className="form-control w-50" />
        {tab === "CUSTOMER" && <button className="btn btn-primary">Add Customer</button>}
        {tab === "VETERINARIAN" && <button className="btn btn-primary">Add Veterinarian</button>}
        {tab === "STAFF" && <button className="btn btn-primary">Add Staff</button>}
      </div>
      <div className="row mb-3 justify-content-center">
        <nav className="w-100">
          <div className="nav nav-tabs " id="nav-tab" role="tablist">
            <button className="nav-link active custom-text-color" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true" onClick={() => setTab("STAFF")} >
              <i className="fas fa-user-tie me-2"></i> Staff
            </button>
            <button className="nav-link custom-text-color" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => setTab("VETERINARIAN")} >
              <i className="fas fa-user-md me-2"></i>Veterinarian
            </button>
            <button className="nav-link custom-text-color" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false" onClick={() => setTab("CUSTOMER")} >
              <i className="fas fa-user me-2"></i>Customer
            </button>

          </div>
        </nav>


      </div>
      {tab === "STAFF" &&
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th >Avatar</th>
                <th>Username</th>
                <th>Name</th>
                <th>Status</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr>
                  <td><img src={staff.image || avatar_default} alt="avatar" style={{ width: '50px', height: '50px' }} /></td>
                  <td>{staff.username}</td>
                  <td>{staff.fullName}</td>
                  <td>{staff.status}</td>
                  <td>{staff.email}</td>
                  <td className="d-flex gap-2" >
                    <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(staff)}>Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal open={isModalPopup} onCancel={() => handleCloseModal()} onOk={isEditUser ? handleSubmitUpdateUser : handleSubmitCreateUser}>
            <StaffForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} handleImageChange={handleImageChange} image={image} isEditUser={isEditUser} />
          </Modal>
        </>
      }
      {tab === "VETERINARIAN" && <table className="table table-bordered">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Name</th>
            <th>Status</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {veterinarians.map((veterinarian) => (
            <tr>
              <td><img src={veterinarian.veterinarian.image || avatar_default} alt="avatar" style={{ width: '50px', height: '50px' }} /></td>
              <td>{veterinarian.username}</td>
              <td>{veterinarian.fullName}</td>
              <td>{veterinarian.veterinarian.status}</td>
              <td>{veterinarian.email}</td>
              <td>{veterinarian.veterinarian.phone}</td>
              <td className="d-flex gap-2" >
                <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(veterinarian)}>Edit</button>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
      {tab === "CUSTOMER" && <table className="table table-bordered">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Name</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr>
              <td><img src={customer.image || avatar_default} alt="avatar" style={{ width: '50px', height: '50px' }} /></td>
              <td>{customer.username}</td>
              <td>{customer.fullName}</td>
              <td>{customer.status}</td>
              <td>{customer.customer.phone}</td>

              <td>{customer.email}</td>
              <td >{customer.customer.address}</td>
              <td className="d-flex gap-2" >
                <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(customer)}>Edit</button>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default UserManagementPage;
