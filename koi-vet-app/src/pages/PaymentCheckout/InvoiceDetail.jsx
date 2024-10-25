import React, { useEffect, useState } from 'react'
import { createInvoiceV2API, fecthServiceByServiceIdAPI, fetchAppointmentByIdAPI, fetchCheckoutAPI, fetchInvoiceByInvoiceId, updateAppointmentAPI, updateInvoiceAPI } from '../../apis';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './InvoiceDetail.css';
import { toast } from 'react-toastify';
import HomeVisitPriceTable from '../../components/HomeVisitPriceTable/HomeVisitPriceTable';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import paid from '../../assets/img/paid_icon.png'

import { Modal } from 'antd';
const InvoiceDetail = ({ isCheckout }) => {
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const location = useLocation();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const { appointmentId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get("invoiceId");
  const navigate = useNavigate();

  const fetchInvoiceDetail = async () => {
    const response = await fetchInvoiceByInvoiceId(invoiceId);
    console.log(response.data)
    setInvoiceDetail(response.data);
  }
  const fetchCheckout = async () => {
    const response = await fetchCheckoutAPI(appointmentId);
    setInvoiceDetail(response.data.invoice);
  }
  useEffect(() => {
    if (isCheckout) {
      fetchCheckout();
    } else {
      fetchInvoiceDetail();
    }
  }, [invoiceId, appointmentDetail]);
  const handleCheckout = async () => {
    Modal.confirm({
      title: "Confirm Checkout",
      content: "Are you sure to confirm checkout?",
      onOk: async () => {
        const invoiceResponse = await createInvoiceV2API(appointmentDetail)
        if (invoiceResponse.status === 200) {
          const res = await updateAppointmentAPI(
            {
              ...invoiceDetail,
              status: "Completed",
              type: "Second"
            }, appointmentId)
          if (res.status === 200) {
            toast.success("Checkout success");
            navigate(-1)
          }
        } else {
          toast.error("Checkout failed");
        }
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAppointmentByIdAPI(appointmentId);
      setAppointmentDetail(response.data);
    }
    fetchData();
  }, [appointmentId]);
  useEffect(() => {
    const fetchServiceDetail = async () => {
      const response = await fecthServiceByServiceIdAPI(appointmentDetail.serviceId);
      setServiceDetail(response.data);
    }

    fetchServiceDetail();
  }, [appointmentDetail]);

  return (
    <div className="row justify-content-center">

      {appointmentDetail?.type === "HOME" && <div className="bill-details col-md-4">
        <HomeVisitPriceTable />
      </div>}
      <div className="bill-details col-md-8">
        {
          appointmentDetail && serviceDetail && (
            <>
              <div className="payment-bill">

                <h2 className='booking-title text-center fw-bold'>INVOICE</h2>
                <p><strong>Appointment Code:</strong> {appointmentDetail.code}</p>
                <p><strong>Appointment Date:</strong> {appointmentDetail.appointmentDate}</p>
                <p><strong>Customer Name:</strong> {appointmentDetail.customerName}</p>
                <p><strong>Service:</strong> {appointmentDetail.serviceName}</p>
                <p><strong>Location:</strong> {appointmentDetail.location}</p>
                <p><strong>Start Time:</strong> {appointmentDetail.startTime}</p>
                <p><strong>End Time:</strong> {appointmentDetail.endTime}</p>

                <table className="bill-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      invoiceDetail?.type === "First" ?
                        <tr >
                          <td>Initial Service Fee</td>
                          <td>1</td>
                          <td>Service</td>
                          <td>{invoiceDetail?.unitPrice?.toLocaleString()} VND</td>
                          <td>{invoiceDetail?.totalPrice?.toLocaleString()} VND</td>
                        </tr>
                        :
                        <>
                          <tr >
                            <td>{serviceDetail.serviceFor === "FISH" ? "Koi" : "Pond"} Fee</td>
                            <td>{appointmentDetail.quantity}</td>
                            <td>{serviceDetail.serviceFor === "FISH" ? "Koi" : "Pond"}</td>
                            <td> {invoiceDetail?.unitPrice?.toLocaleString()} VND</td>
                            <td>{invoiceDetail?.totalPrice?.toLocaleString()} VND</td>
                          </tr>
                          <tr>
                            <td>Home visit fee</td>
                            <td>{appointmentDetail.distance}</td>
                            <td>Km</td>
                            <td>{appointmentDetail.homeVisitPrice.toLocaleString()} VND/Km</td>
                            <td>{appointmentDetail.totalHomeVisitFee.toLocaleString()} VND</td>
                          </tr>
                        </>
                    }

                  </tbody>
                </table>

                <div className="summary text-end d-flex justify-content-end">
                  {
                    isCheckout &&
                    <div className="text-start ">
                      <p><strong>Deposited :</strong> {appointmentDetail.depositedMoney.toLocaleString()} VND</p>
                      <p><strong>Balance Due:</strong> {appointmentDetail.balanceDue.toLocaleString()} VND</p>
                    </div>
                  }
                </div>
                {
                  invoiceDetail?.status === "Completed" &&
                  <div className="text-end d-flex justify-content-end">
                    <img src={paid} alt="paid" width={100} height={100} style={{ transform: "rotate(20deg)" }} />
                  </div>
                }
                 {
                  invoiceDetail?.status === "Refunded" &&
                  <div className="text-end d-flex justify-content-end">
                    <img src={paid} alt="paid" width={100} height={100} style={{ transform: "rotate(20deg)" }} />
                  </div>
                }
              </div>
            </>
          )
        }

      </div>
      <div className='button-container d-flex justify-content-between mt-3'>
        <button className='btn btn-primary' onClick={() => navigate(-1)}>Back</button>
        {
          isCheckout ?
            <button className='btn btn-primary' onClick={() => handleCheckout()}>Confirm Checkout</button>
            :
            null
        }
      </div>
    </div>

  )
}


export default InvoiceDetail
