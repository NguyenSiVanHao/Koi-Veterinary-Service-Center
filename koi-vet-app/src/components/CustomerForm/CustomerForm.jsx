import { Button, Image, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React from "react";
import avatar_default from "../../assets/img/profile_default.png";

const CustomerForm = ({ selectedUser, setSelectedUser, handleImageChange, image, isEditUser }) => {
    console.log("selectedUser fss", selectedUser);
    return (
        <div className="d-flex flex-column gap-2">
            {!isEditUser && 
            <div className="d-flex flex-column">
                <label>Username</label>
                <input type="text" value={selectedUser?.username || ""} onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
            </div>}
            {!isEditUser && <div className="d-flex flex-column">
                <label>Password</label>
                <input type="text" value={selectedUser?.password || ""} onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })} />
            </div>}
            <div className="d-flex flex-column">
                <label>Full Name</label>
                <input type="text" value={selectedUser?.fullName || ""} onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
            </div>
            <div className="d-flex flex-column">
                <label>Email</label>
                <input type="text" value={selectedUser?.email || ""} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
            </div>
            <div className="d-flex flex-column">
                    <label className="">Phone Number</label>
                    <input type="text" value={selectedUser?.customer?.phone || ''} onChange={(e) => setSelectedUser({ ...selectedUser, customer: { ...selectedUser.customer, phone: e.target.value } })}/>
                </div>
            <div className="d-flex flex-column">
                    <label className="">Address</label>
                    <textarea value={selectedUser?.customer?.address || ''} onChange={(e) => setSelectedUser({ ...selectedUser, customer: { ...selectedUser.customer, address: e.target.value } })}/>
                </div>
                <label htmlFor='image' className='form-label mt-3'>Image</label>
                <div className="d-flex flex-column gap-2 ">
                    <Image width={300} src={image ? URL.createObjectURL(image) : selectedUser?.customer?.image} alt={selectedUser?.fullName}/>
                    <div style={{ width: '300px' }}>
                        <Button className='mt-2 p-3 mx-6'>
                            <ImgCrop rotationSlider aspect={12 / 16}>
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

        </div>
    );
};

export default CustomerForm;
