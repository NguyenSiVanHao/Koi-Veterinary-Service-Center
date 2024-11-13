import React, { useEffect, useState } from "react";
import "./UserManagementPage.css"
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { createCustomerAPI, createStaffAPI, createVetAPI, deleteUserAPI, fecthAllServicesAPI, fetchAllUsersAPI, updateUserInfoAPI, updateVetByIdAPI } from "../../apis";
import avatar_default from "../../assets/img/profile_default.png"
import { Modal } from "antd";
import StaffForm from "../../components/StaffForm/StaffForm";
import VeterinarianForm from "../../components/VeterinarianForm";
import { useSelector } from "react-redux";
import { ROLE } from "../../utils/constants";
import { toast } from "react-toastify";
import CustomerForm from "../../components/CustomerForm/CustomerForm";

const UserManagementPage = () => {
  const [tab, setTab] = useState("VETERINARIAN");
  const [staffs, setStaffs] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const role = useSelector(state => state.user.role)
  const [customers, setCustomers] = useState([]);
  const [serviceList, setServiceList] = useState([]);
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
  const handleOpenModalEditUser = (userData, isEdit) => {
    console.log("userData", userData);
    setSelectedUser(userData); // Tạo một bản sao của userData
    console.log("selectedUser", selectedUser);
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
  }
  const handleChangeUserStatus = async (userData) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this user?',
      onOk: async () => {
        const res = await deleteUserAPI(userData.user_id);
        if (res.status === 200) {
          fetchUserData();
        }
      },
    });
  }
  const handleCloseModal = () => {
    console.log("selectedUser", selectedUser);
    setSelectedUser(null);
    setIsModalPopup(false);
    setIsModalVeterinarianPopup(false);
    setIsModalCustomerPopup(false);
    setImage(null);
    setIsEditUser(false);
  }
  const fetchUserData = async () => {
    try {
      const res = await fetchAllUsersAPI(tab);
      if (tab === "STAFF") {
        setStaffs(res.data);
      } else if (tab === "VETERINARIAN") {
        setVeterinarians(res.data);
      } else if (tab === "CUSTOMER") {
        setCustomers(res.data);
      }
    }
    catch (e) {
      toast.error(e.message);
    }

  }
  const handleSubmitCreateUser = async () => {
    let response;
    switch (tab) {
      case "STAFF":
        response = await createStaffAPI(
          {
            "email": selectedUser.email,
            "password": selectedUser.password,
            "username": selectedUser.username,
            "fullname": selectedUser.fullName,
            "address": selectedUser.address,
            "phone": selectedUser.phone,
            "status": selectedUser.status,
            "image": null
          }
          , image);
        break;
      case "VETERINARIAN":
        response = await createVetAPI(
          {

            "status": "string",
            "description": selectedUser.veterinarian.description,
            "google_meet": selectedUser.veterinarian.googleMeet,
            "phone": selectedUser.veterinarian.phone,
            "image": selectedUser.veterinarian.image,
            "user": {
              "email": selectedUser.email,
              "username": selectedUser.username,
              "password": selectedUser.password,
              "fullname": selectedUser.fullName,
              "address": selectedUser.address,
              "phone": selectedUser.phone,
              "status": selectedUser.status,
              "image": null
            },
            "service": selectedUser.veterinarian.listOfServices

          }
          , image);
        break;
      case "CUSTOMER":
        response = await createCustomerAPI({
          "email": selectedUser.email,
          "password": selectedUser.password,
          "username": selectedUser.username,
          "fullname": selectedUser.fullName,
          "address": selectedUser.customer.address,
          "phone": selectedUser.customer.phone,
          "image": null
        }, image);
        break;
      default:
        break;
    }
    if (response.status === 200) {
      fetchUserData();
      handleCloseModal();
    }
  }
  const handleSubmitUpdateUser = async () => {
    let response;
    switch (tab) {
      case "STAFF":
        response = await updateUserInfoAPI({
          "userId": selectedUser.user_id,
          "fullName": selectedUser.fullName,
          "email": selectedUser.email,
          "phoneNumber": selectedUser.phoneNumber,
          "image": image
        }, image);
        break;
      case "VETERINARIAN":
        response = await updateVetByIdAPI(selectedUser.veterinarian.vetId,
          {

            "status": "string",
            "description": selectedUser.veterinarian.description,
            "google_meet": selectedUser.veterinarian.googleMeet,
            "phone": selectedUser.veterinarian.phone,
            "image": selectedUser.veterinarian.image,
            "user": {
              "email": selectedUser.email,
              "username": selectedUser.username,
              "fullname": selectedUser.fullName,
              "address": selectedUser.address,
              "phone": selectedUser.phone,
              "status": selectedUser.status,
              "image": null
            },
            "service": selectedUser.veterinarian.listOfServices

          }
          , image);
        break;
      case "CUSTOMER":
        response = await updateUserInfoAPI({
          "userId": selectedUser.user_id,
          "fullName": selectedUser.fullName,
          "email": selectedUser.email,
          "phoneNumber": selectedUser.customer.phone,
          "address": selectedUser.customer.address,
          "image": image
        }, image);
        break;
      default:
        break;
    }
    if (response.status === 200) {
      fetchUserData();
      handleCloseModal();
    }
  }
  const fetchServiceList = async () => {
    const res = await fecthAllServicesAPI();
    setServiceList(res.data);
  }
  useEffect(() => {
    if (role === ROLE.ADMIN) {
      setTab("STAFF");
    }
  }, [role])
  useEffect(() => {
    fetchUserData();
    if (tab === "VETERINARIAN") {
      fetchServiceList();
    }
  }, [tab])

  return (
    <div className="container">
      <AdminHeader title="User Management" />
      <div className="d-flex justify-content-between align-items-center text-center mb-3">
        <input type="text" placeholder="Search" className="form-control w-50" />
        {tab === "CUSTOMER" && <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(null, false)}>Add Customer</button>}
        {tab === "VETERINARIAN" && <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(null, false)}>Add Veterinarian</button>}
        {tab === "STAFF" && <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(null, false)}>Add Staff</button>}
      </div>
      <div className="row mb-3 justify-content-center">
        <nav className="w-100">
          <div className="nav nav-tabs " id="nav-tab" role="tablist">
            <button className="nav-link custom-text-color" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => setTab("VETERINARIAN")} >
              <i className="fas fa-user-md me-2"></i>Veterinarian
            </button>
            {role === ROLE.MANAGER && <button className="nav-link active custom-text-color" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true" onClick={() => setTab("STAFF")} >
              <i className="fas fa-user-tie me-2"></i> Staff
            </button>}
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
                  <td>{staff.status ? "Active" : "Inactive"}</td>
                  <td>{staff.email}</td>
                  <td className="d-flex gap-2" >
                    <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(staff, true)}>Edit</button>
                    {staff.status ? <button className="btn btn-danger" onClick={() => handleChangeUserStatus(staff)}>Deactive</button>
                      : <button className="btn btn-success" onClick={() => handleChangeUserStatus(staff)}>Active</button>
                    }
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
      {tab === "VETERINARIAN" &&
        <>
          <table className="table table-bordered">
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
                  <td>{veterinarian.status ? "Active" : "Inactive"}</td>
                  <td>{veterinarian.email}</td>
                  <td>{veterinarian.veterinarian.phone}</td>
                  <td className="d-flex gap-2" >
                    <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(veterinarian, true)}>Edit</button>
                    {veterinarian.status ? <button className="btn btn-danger" onClick={() => handleChangeUserStatus(veterinarian)}>Deactive</button>
                      : <button className="btn btn-success" onClick={() => handleChangeUserStatus(veterinarian)}>Active</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalVeterinarianPopup && <Modal open={isModalVeterinarianPopup} onCancel={() => handleCloseModal()} onOk={isEditUser ? handleSubmitUpdateUser : handleSubmitCreateUser} width={900}>
            <VeterinarianForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} handleImageChange={handleImageChange} image={image} isEditUser={isEditUser} serviceList={serviceList} />
          </Modal>}
        </>
      }
      {tab === "CUSTOMER" && 
      <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Name</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr>
              <td><img src={customer.image || avatar_default} alt="avatar" style={{ width: '50px', height: '50px' }} /></td>
              <td>{customer.username}</td>
              <td>{customer.fullName}</td>
              <td>{customer.status ? "Active" : "Inactive"}</td>
              <td>{customer.customer.phone}</td>
              <td>{customer.email}</td>
              <td >{customer.customer.address}</td>
              <td className="d-flex gap-2" >
                <button className="btn btn-primary" onClick={() => handleOpenModalEditUser(customer, true)}>Edit</button>
                {customer.status ? <button className="btn btn-danger" onClick={() => handleChangeUserStatus(customer)}>Deactive</button>
                  : <button className="btn btn-success" onClick={() => handleChangeUserStatus(customer)}>Active</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={isModalCustomerPopup} onCancel={() => handleCloseModal()} onOk={isEditUser ? handleSubmitUpdateUser : handleSubmitCreateUser}>
            <CustomerForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} handleImageChange={handleImageChange} image={image} isEditUser={isEditUser} />
        </Modal>
      </>}
    </div>
  );
};

export default UserManagementPage;
