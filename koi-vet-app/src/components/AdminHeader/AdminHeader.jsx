import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { ROLE } from '../../utils/constants';
import { Image, Modal } from 'antd';
const AdminHeader = ({ title }) => {
    const role = useSelector(state => state.user.role);
    const user = useSelector(state => state.user);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const handleOpenModal = () => {
        setIsOpenModal(true);
    }
    const handleCloseModal = () => {
        setIsOpenModal(false);
    }
    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="booking-title fw-semibold">{title}</h2>
                <div className="btn-toolbar mb-2 mb-md-0">
                    {role !== ROLE.CUSTOMER ? (
                        <div className="btn-group me-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsOpenModal(true)}>
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="User Avatar"
                                    className="rounded-circle"
                                    width="30"
                                    height="30"
                                />
                                {user?.fullName}
                            </button>
                        </div>
                    ) : null}
                </div>
                <Modal open={isOpenModal} onCancel={handleCloseModal} onOk={handleCloseModal} width={700}>
                    <div className='d-flex justify-content-center flex-column align-items-center'>
                        <h3 className='fw-semibold booking-title'>My Information</h3>
                        <div className="d-flex flex-row align-items-start space-between gap-3">
                            <div className='d-flex justify-content-center align-items-center'>
                                <Image src={user?.image} alt='User Avatar' width={100} height={100} />
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0'>UserName: {user?.fullName}</p>
                                <p className='mb-0'>Email: {user?.email}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default AdminHeader