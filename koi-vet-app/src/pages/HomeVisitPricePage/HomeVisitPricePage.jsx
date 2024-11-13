import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/AdminHeader/AdminHeader'
import { createHomeVisitPriceAPI, deleteHomeVisitPriceAPI, fetchHomeVisitPriceAPI, updateHomeVisitPriceAPI } from '../../apis'
import { Modal } from 'antd'
import { toast } from 'react-toastify'

const HomeVisitPricePage = () => {
    const [homeVisitPrice, setHomeVisitPrice] = useState([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState(false)
    const [selectedDelivery, setSelectedDelivery] = useState(null)  
    useEffect(() => {
        fetchHomeVisitPrice()
    }, [])
    const fetchHomeVisitPrice = async () => {
        const res = await fetchHomeVisitPriceAPI()
        setHomeVisitPrice(res.data)
    }

    const showEditModal = (delivery) => {
        setSelectedDelivery(delivery)
        setIsEditModalVisible(true)
    }

    const showAddModal = async () => {
        await setSelectedDelivery(null)
        await setIsAddModalVisible(true)
    }
    const closeAddModal = () => {
        setIsAddModalVisible(false)
    }

    const handleOkEdit = async () => {
        // Handle the edit logic here
        console.log(selectedDelivery)
        const res = await updateHomeVisitPriceAPI(selectedDelivery.deliveryId, selectedDelivery)
        if (res.status === 200) {
            fetchHomeVisitPrice()
        } else {
            toast.error(res.message)
        }

        setIsEditModalVisible(false)
    }

    const handleOkAdd = async () => {
        // Handle the create logic here
        const res = await createHomeVisitPriceAPI(selectedDelivery)
        if (res.status === 200) {
            fetchHomeVisitPrice()
            toast.success('Add success')
        } else {
            toast.error(res.message)
        }
        setIsAddModalVisible(false)
    }

    const handleCancelEdit = () => {
        setIsEditModalVisible(false)
    }

    const handleDelete = (delivery) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this delivery?',
            onOk: async () => {
                const res = await deleteHomeVisitPriceAPI(delivery.deliveryId)
                if (res.status === 200) {
                    fetchHomeVisitPrice()
                } else {
                    toast.error(res.message)
                }
            },
        });
    }

    // Sắp xếp dữ liệu theo fromPlace và toPlace
    const sortedHomeVisitPrice = [...homeVisitPrice].sort((a, b) => {
        if (a.fromPlace === b.fromPlace) {
            return a.toPlace - b.toPlace; // Sắp xếp theo toPlace nếu fromPlace bằng nhau
        }
        return a.fromPlace - b.fromPlace; // Sắp xếp theo fromPlace
    });

    return (
        <div>
            <AdminHeader title="Home Visit Price" />
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>From (km)</th>
                                    <th>To (km)</th>
                                    <th>Price (VND/km)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHomeVisitPrice.map((delivery, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{delivery.fromPlace}</td>
                                        <td>{delivery.toPlace}</td>
                                        <td>{delivery.price.toLocaleString()}</td>
                                        <td className='d-flex gap-2'>
                                            <button className="btn btn-primary" onClick={() => showEditModal(delivery)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(delivery)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-md-12 mt-3'>
                        <button className="btn btn-primary" onClick={() => showAddModal()}><i className="fa-solid fa-plus"></i> Add </button>
                    </div>
                </div>
            </div>
            <Modal title="Edit Delivery Price" open={isEditModalVisible} onOk={handleOkEdit} onCancel={handleCancelEdit}>
                <label>From (km)</label>
                <input type="number" value={selectedDelivery?.fromPlace} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, fromPlace: e.target.value })} />
                <label>To (km)</label>
                <input type="number" value={selectedDelivery?.toPlace} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, toPlace: e.target.value })} />
                <label>Price (VND/km)</label>
                <input type="number" value={selectedDelivery?.price} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, price: e.target.value })} />
            </Modal>
            {/* Modal add new */}
            <Modal title="Add Delivery Price" open={isAddModalVisible} onOk={handleOkAdd} onCancel={closeAddModal}>
                <label>From (km)</label>
                <input type="number" value={selectedDelivery?.fromPlace} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, fromPlace: e.target.value })} />
                <label>To (km)</label>
                <input type="number" value={selectedDelivery?.toPlace} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, toPlace: e.target.value })} />
                <label>Price (VND/km)</label>
                <input type="number" value={selectedDelivery?.price} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, price: e.target.value })} />
            </Modal>
        </div>
    )
}

export default HomeVisitPricePage
