import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { ROLE } from '../../utils/constants';
import { Button, Image, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateUserInfoAPI } from '../../apis';
const AdminHeader = ({ title }) => {
    const role = useSelector(state => state.user.role);
    const user = useSelector(state => state.user);
    const [image, setImage] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const handleOpenModal = () => {
        setIsOpenModal(true);
    }
    const handleImageChange = async (file) => {
        await setImage(file);
        await updateUserInfoAPI({
            userId: user.user_id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            image: user.image
        }, file);
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
                                   src={(image ? URL.createObjectURL(image) :(role === ROLE.VETERINARIAN?user.veterinarian.image: user?.image)) ||
                                    'https://koicenter.azurewebsites.net/images/default-avatar.png'}
                                    alt="User Avatar"
                                    className="rounded-circle me-2"
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
                            <div className='d-flex justify-content-center align-items-center flex-column' >
                                <Image src={(image ? URL.createObjectURL(image) : user?.image) ||
                                    'https://koicenter.azurewebsites.net/images/default-avatar.png'} alt='User Avatar' width={100} height={100} />
                                <div style={{ width: '300px' }} className='text-center'>
                                    <Button className='mt-2 p-3 mx-6'>
                                        <ImgCrop rotationSlider >
                                            <Upload
                                                listType="picture" // Giữ nguyên để chỉ tải lên một bức ảnh
                                                beforeUpload={(file) => {
                                                    handleImageChange(file); // Gọi handleImageChange với tệp
                                                    return false; // Ngăn không cho gửi yêu cầu tải lên
                                                }}
                                                showUploadList={false} // Ẩn danh sách tải lên
                                            >
                                                <i className="fa-solid fa-upload"></i> Upload
                                            </Upload>
                                        </ImgCrop></Button>

                                </div>
                            </div>
                            <div className='d-flex flex-column align-items-start'>
                                <p className='mb-0'>Full Name: {user?.fullName}</p>
                                <p className='mb-0'>Email: {user?.email}</p>
                                <p className='mb-0'>Role: {user?.role}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default AdminHeader