import React, { useEffect, useState } from "react";
import { fetchInvoicesByAppointmentIdAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const InvoiceList = ({appointment}) => {
    const [invoices,setInvoices] = useState(null)
    const role = useSelector(state => state.user.role);
    const fetchInvoicesAppointmentId = async () => {
        const response = await fetchInvoicesByAppointmentIdAPI(appointment?.appointmentId);
        setInvoices(response.data);
    }
    const navigate = useNavigate();
    const handleViewDetail = (appointmentId,invoiceId) => {
        if (role === "CUSTOMER") {
            navigate(`/profile/invoice-detail/${appointmentId}?invoiceId=${invoiceId}`);
        } else {
            navigate(`/admin/invoice-detail/${appointmentId}?invoiceId=${invoiceId}`);
        }
    }
    useEffect(() => {
        fetchInvoicesAppointmentId();
    }, [appointment]);

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        }).format(new Date(dateString));
    };

    return (
        <div className="d-flex align-items-center justify-content-between flex-column">
            <h3 className="booking-title">Invoice List</h3>

            <table>
                <thead>
                    <tr>
                        <th>Create Date</th>
                        <th>Status</th>
                        <th>Total(VND)</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody> 
                    {
                        invoices?.map((invoice,index) => (
                                <tr key={invoice?.id}>
                                    <td>{formatDate(invoice?.createAt)}</td>
                                    <td>{invoice?.status === "Completed" ? "Paid" : "Refunded"}</td>
                                    <td>{invoice?.totalPrice.toLocaleString()}</td>
                                    <td>
                                        <button 
                                        className="btn btn-primary"
                                        onClick={() => handleViewDetail(appointment?.appointmentId,invoice.invoiceId)}
                                        >View</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;
