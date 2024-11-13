import React, { useEffect, useState, useCallback } from "react";
import debounce from 'lodash/debounce';
import { Link } from "react-router-dom";
import "./AllAppointment.css";
import {
  fetchAllAppointmentAPI,
  fetchAllAppointmentByVetIdAPI,
  fetchAppointmentByCustomerIdAPI,
} from "../../apis";
import { ROLE, APPOINTMENT_STATUS } from "../../utils/constants";
import { useSelector } from "react-redux";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import PreLoader from "../../components/Preloader/Preloader";
import refund from "../../assets/img/refund logo.svg"
import { toast } from "react-toastify";

function AllAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const customerId = useSelector((state) => state?.user?.customer?.customerId);
  const [title, setTitle] = useState("All Appointments");
  const [search, setSearch] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const vetId = useSelector((state) => state?.user?.veterinarian?.vetId);
  const role = useSelector((state) => state.user.role);
  const [isLoading, setIsLoading] = useState(true);
  const [offSet, setOffSet] = useState(1);
  const handleChangePage = async (event, value) => {
    await setAppointments([]);
    await setSearch(null);
    await setTotalPage(0);
    setOffSet(value);
  };

  // Create a debounced function
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setAppointments([]);
      setOffSet(1);
      setDebouncedSearch(value);
    }, 1000),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    
    debouncedSetSearch(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchAppointmentForVet = async (vetId, status, pageSize, search, offSet) => {
      try {
        const response = await fetchAllAppointmentByVetIdAPI(vetId, status, offSet, pageSize, search);
        setAppointments(response?.data?.content);
        setTotalPage(response?.data?.totalPages);
        setIsLoading(false);
        console.log(response?.data)
      } catch (error) {
       if(search){
          toast.error("Not found any appointment with this search");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAppointmentForStaff = async (search) => {
      try {
        const response = await fetchAllAppointmentAPI(status, offSet, pageSize, search);
        setAppointments(response?.data?.content);
        setTotalPage(response?.data?.totalPages);
        setIsLoading(false);
      } catch (error) {
        if(search){
          toast.error("Not found any appointment with this search");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAppointmentForCustomer = async (customerId, status, offSet, pageSize, search) => {
      try {
        const response = await fetchAppointmentByCustomerIdAPI(customerId, status, offSet, pageSize, search);
        setAppointments(response?.data?.content);
        setTotalPage(response?.data?.totalPages);
        setIsLoading(false);
        setTitle("My Appointments");
      } catch (error) {
        if(search){
          toast.error("Not found any appointment with this search");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (role === ROLE.VETERINARIAN) {
      fetchAppointmentForVet(vetId, status, pageSize, debouncedSearch, offSet);
      setTitle("All My Appointments");
    } else if (role === ROLE.STAFF || role === ROLE.MANAGER) {
      fetchAppointmentForStaff(debouncedSearch);
      setTitle("All Veterinarian Appointments");
    } else if (role === ROLE.CUSTOMER) {
      fetchAppointmentForCustomer(customerId, status, offSet, pageSize, debouncedSearch);
      setTitle("My Appointments");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, customerId, status, pageSize, offSet, debouncedSearch]);

  const handleChangeStatus = (newStatus) => {
    if(newStatus !== status){
      setAppointments([]);
      setStatus(newStatus);
    }
    setOffSet(1);
    setSearch(null);
    console.log("status", status)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <>
      {isLoading && <PreLoader />}
      <AdminHeader title={title} />

      <div className="row mb-3 justify-content-center">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
            {/* Remove the search button if not needed */}
          </div>
        </div>
      </div>
      <div className="row mb-3 justify-content-center">
        <nav className="w-100">
          <div className="nav nav-tabs " id="nav-tab" role="tablist">
            <button className="nav-link active custom-text-color" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true" onClick={() => handleChangeStatus("ALL")}>
              <i className="fas fa-list-ul me-2"></i>All
            </button>
            {role !== ROLE.VETERINARIAN && <button className="nav-link custom-text-color" id="nav-profile-tab" data-bs-toggle="tab"  type="button" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.CREATED)}>
              <i className="fa-solid fa-hourglass-start "></i> Waiting
            </button>}
            <button className="nav-link custom-text-color" id="nav-profile-tab" data-bs-toggle="tab"  type="button" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.BOOKING_COMPLETE)}>
              <i className="fas fa-user-md me-2"></i>Veterinarian Assigned
            </button>
            <button className="nav-link custom-text-color" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.PROCESS)}>
              <i className="fas fa-spinner me-2"></i>Process
            </button>
            <button className="nav-link custom-text-color" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.READY_FOR_PAYMENT)}>
              <i className="fas fa-dollar-sign me-2 text-warning"></i>Payment Processing
            </button>
            <button className="nav-link custom-text-color" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.FINISH)}>
              <i className="fas fa-flag-checkered me-2 text-success"></i>Finish
            </button>
            <button className="nav-link custom-text-color" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.CANCEL)}>
              <i className="fas fa-ban me-2 text-danger"></i>Cancel
            </button>
            <button className="nav-link custom-text-color" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.REFUNDABLE)}>
              <img className="me-2 text-warning" style={{ width: '20px', height: '20px' }} src={refund} alt="Refund Icon" /> Need to refund
            </button>
            <button className="nav-link custom-text-color" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" onClick={() => handleChangeStatus(APPOINTMENT_STATUS.REFUND)}>
              <img className="me-2 text-warning" style={{ width: '20px', height: '20px' }} src={refund} alt="Refund Icon" /> Refunded
            </button>
            
          </div>
        </nav>


      </div>
      <div className="table-responsive">
        <table className="table table-striped table-md tableleft">
          <thead>
            <tr>
              <th>Code</th> <th>Customer</th> <th>Service</th><th>Create Date</th> <th>Type</th> <th>Time</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>

            {
              appointments?.length === 0 ?
                <tr>
                  <td colSpan="9" className="text-center">No appointments found</td>
                </tr>
                :
                appointments?.map((appointmentDetail, index) => (
                  <tr key={index}>
                    <td>{appointmentDetail.code}</td>
                    <td>{appointmentDetail.customerName}</td>
                    <td>{appointmentDetail.serviceName}</td>
                    <td>{new Date(appointmentDetail.createdAt).toLocaleString()}</td>
                    <td>{appointmentDetail.type}</td>
                    <td>{formatTime(appointmentDetail.startTime)}</td>
                    <td>{formatDate(appointmentDetail.appointmentDate)}</td>
                    <td>
                      {(() => {
                        switch (appointmentDetail.status) {
                          case APPOINTMENT_STATUS.CREATED:
                            return <button className="btn btn-sm btn-warning"> <i className="fa-solid fa-hourglass-start me-2"></i>Waiting</button>;
                          case APPOINTMENT_STATUS.BOOKING_COMPLETE:
                            return <button className="btn btn-sm btn-info "> <i className="fas fa-user-md me-2"></i>Veterinarian Assigned</button>;
                          case APPOINTMENT_STATUS.PROCESS:
                            return <button className="btn btn-sm btn-primary"> <i className="fas fa-spinner me-2"></i>Process</button>;
                          case APPOINTMENT_STATUS.READY_FOR_PAYMENT:
                            return <button className="btn btn-sm btn-warning"> <i className="fas fa-dollar-sign me-2"></i>Payment Processing</button>;
                          case APPOINTMENT_STATUS.FINISH:
                            return <button className="btn btn-sm btn-success"> <i className="fas fa-flag-checkered me-2"></i>Finish</button>;
                          case APPOINTMENT_STATUS.CANCEL:
                            return <button className="btn btn-sm btn-danger"> <i className="fas fa-ban me-2"></i>Cancel</button>;
                          case APPOINTMENT_STATUS.REFUND:
                            return <button className="btn btn-sm btn-info">Refunded</button>;
                          case APPOINTMENT_STATUS.REFUNDABLE:
                            return <button className="btn btn-sm btn-warning">Need to refund</button>;
                          default:
                            return <button className="btn btn-sm btn-secondary">Unknown Status</button>;
                        }
                      })()}
                    </td>
                    <td>
                      {role === ROLE.CUSTOMER ?
                        <Link
                          to={`/profile/appointment/${appointmentDetail.appointmentId}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </Link>
                        :
                        <Link
                          to={`/admin/appointment/${appointmentDetail.appointmentId}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                      }
                    </td>
                  </tr>
                ))
            }


          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Pagination
            count={totalPage}
            page={offSet}
            onChange={(event, value) => handleChangePage(event, value)}
          />
          <FormControl variant="outlined" size="small" style={{ minWidth: 120, marginRight: 16 }}>
            <InputLabel id="page-size-select-label">Page Size</InputLabel>
            <Select
              labelId="page-size-select-label"
              id="page-size-select"
              value={pageSize}
              onChange={(event) => {
                setPageSize(event.target.value);
                setOffSet(1);
              }}
              label="Page Size"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </div>

      </div>
    </>
  );
}

export default AllAppointment;
