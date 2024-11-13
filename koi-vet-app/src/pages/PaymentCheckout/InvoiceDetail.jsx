import React, { useEffect, useState } from 'react'
import { createInvoiceV2API, fecthServiceByServiceIdAPI, fetchAppointmentByIdAPI, fetchCheckoutAPI, fetchInvoiceByInvoiceId, refundAppointmentAPI, updateAppointmentAPI, updateInvoiceAPI } from '../../apis';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './InvoiceDetail.css';
import { toast } from 'react-toastify';
import HomeVisitPriceTable from '../../components/HomeVisitPriceTable/HomeVisitPriceTable';
import paid from '../../assets/img/paid_icon.png'
import refund from '../../assets/img/refund.jpg'
import { Modal } from 'antd';
import { APPOINTMENT_STATUS, ROLE } from '../../utils/constants';
import { useSelector } from 'react-redux';
const InvoiceDetail = ({ isCheckout }) => {
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const location = useLocation();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [depositeMoney, setDepositeMoney] = useState(null);
  const [checkOutData, setCheckOutData] = useState({
    "unitPrice": 0,
    "totalUnitPrice": 0,
    "quantity": 0,
    "distance": 0,
    "deliveryPrice": 0,
    "totalDeliveryPrice": 0,
    "totalPrice": 0
  });
  const { appointmentId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get("invoiceId");
  const navigate = useNavigate();
  const role = useSelector(state => state?.user?.role);
  const fetchInvoiceDetail = async () => {
    const response = await fetchInvoiceByInvoiceId(invoiceId);
    console.log(response.data)
    setInvoiceDetail(response.data);
  }
  const handleRefund = async () => {
    Modal.confirm({
      title: "Confirm Refund",
      content: "Are you sure to confirm refund money?",
      onOk: async () => {
        const response = await refundAppointmentAPI(appointmentId);
        if (response.status === 200) {
          toast.success("Refund success");
          navigate(-1)
        } else {
          toast.error(response.data.message)
        }
      }
    })
  }
  const fetchCheckout = async () => {
    const response = await fetchCheckoutAPI(appointmentId);
    setInvoiceDetail(response.data.invoice);
    setDepositeMoney(response.data.depositeMoney);
  }
  useEffect(() => {
    if (isCheckout) {
      fetchCheckout();
    } else {
      fetchInvoiceDetail();
    }
  }, [invoiceId, appointmentDetail]);
  useEffect(() => {
    if (invoiceDetail && serviceDetail) {
      setCheckOutData(prev => ({
        ...prev,
        "unitPrice": serviceDetail?.serviceFor === "FISH" ? serviceDetail?.koiPrice : serviceDetail?.pondPrice,
        "totalUnitPrice": serviceDetail?.serviceFor === "FISH" ? serviceDetail?.koiPrice * invoiceDetail?.quantity : serviceDetail?.pondPrice * invoiceDetail?.quantity,
        "quantity": invoiceDetail?.quantity,
        "distance": invoiceDetail?.distance,
        "deliveryPrice": invoiceDetail?.deliveryPrice,
        "totalDeliveryPrice": invoiceDetail?.distance * invoiceDetail?.deliveryPrice,
      }))
    }
  }, [invoiceDetail, serviceDetail])
  useEffect(() => {
    if (checkOutData) {
      setCheckOutData(prev => ({
        ...prev,
        "totalPrice": (prev.totalDeliveryPrice + prev.totalUnitPrice)
      }))
    }
  }, [checkOutData.totalDeliveryPrice, checkOutData.totalUnitPrice])
  const handleCheckout = async () => {
    Modal.confirm({
      title: "Confirm Checkout",
      content: "Are you sure to confirm checkout?",
      onOk: async () => {
        const invoiceResponse = await createInvoiceV2API({
          "unitPrice": checkOutData.unitPrice,
          "totalPrice": checkOutData.totalPrice,
          "createAt": new Date(),
          "appointmentId": appointmentId,
          "quantity": checkOutData.quantity,
          "status": "Completed",
          "type": "Second",
          "distance": checkOutData.distance,
          "deliveryPrice": checkOutData.deliveryPrice
        })
        if (invoiceResponse.status === 201) {
          const res = await updateAppointmentAPI(
            {
              ...appointmentDetail,
              "status": APPOINTMENT_STATUS.FINISH,
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

      {appointmentDetail?.type === "HOME" && isCheckout &&
        <div className="bill-details col-md-4">
          <HomeVisitPriceTable />
        </div>}
      <div className="bill-details col-md-8">
        {
          appointmentDetail && serviceDetail && (
            <>
              <div className="payment-bill">

                <h2 className='booking-title text-center fw-bold'>{isCheckout ? "PROVISIONAL INVOICE" : "INVOICE"}</h2>
                <p><strong>Appointment Code:</strong> #{appointmentDetail?.code}</p>
                <p><strong>Invoice Code:</strong> #{invoiceDetail?.code}</p>
                <p><strong>Appointment Date:</strong> {appointmentDetail?.appointmentDate}</p>
                <p><strong>Customer Name:</strong> {appointmentDetail?.customerName}</p>
                <p><strong>Service:</strong> {appointmentDetail?.serviceName}</p>
                <p><strong>Location:</strong> {appointmentDetail?.location}</p>
                <p><strong>Start Time:</strong> {appointmentDetail?.startTime}</p>
                <p><strong>End Time:</strong> {appointmentDetail?.endTime}</p>

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
                            <td>{serviceDetail?.serviceFor === "FISH" ? "Koi" : "Pond"} Fee</td>
                            <td>{checkOutData?.quantity}</td>
                            <td>{serviceDetail?.serviceFor === "FISH" ? "Koi" : "Pond"}</td>
                            <td> {checkOutData?.unitPrice?.toLocaleString()} VND</td>
                            <td>{checkOutData?.totalUnitPrice?.toLocaleString()} VND</td>
                          </tr>
                          {appointmentDetail.type === "HOME" && <tr>
                            <td>Home visit fee</td>
                            <td>{invoiceDetail?.distance}</td>
                            <td>Km</td>
                            <td>{checkOutData?.deliveryPrice?.toLocaleString()} VND/Km</td>
                            <td>{checkOutData?.totalDeliveryPrice?.toLocaleString()} VND</td>
                          </tr>}
                        </>
                    }

                  </tbody>
                </table>

                <div className="summary text-end d-flex justify-content-end">


                  <div className="text-start ">
                    {isCheckout && <p><strong>Deposited :</strong> {depositeMoney?.toLocaleString()} VND</p>}
                    {isCheckout ?
                      <p><strong>Balance Due:</strong> {checkOutData?.totalPrice?.toLocaleString()} VND</p>
                      :
                      <p><strong>Total Paid:</strong> {invoiceDetail?.totalPrice?.toLocaleString()} VND</p>
                    }


                  </div>

                </div>
                {
                  invoiceDetail?.status === "Completed" &&
                  <div className="text-end d-flex justify-content-end">
                    <img src={paid} alt="paid" width={100} height={100} style={{ transform: "rotate(20deg)" }} />
                  </div>
                }
                {role !== ROLE.CUSTOMER && appointmentDetail?.status === APPOINTMENT_STATUS.REFUNDABLE &&
                  <div className="text-end d-flex justify-content-end">
                    <button className='btn btn-primary' onClick={() => handleRefund()}>Confirm Refund <i className="fas fa-undo-alt"></i></button>
                  </div>
                }
                {
                  invoiceDetail?.status === "Refund" &&
                  <div className="text-end d-flex justify-content-end">
                    <img src={refund} alt="refund" width={100} height={100} style={{ transform: "rotate(0deg)" }} />
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
