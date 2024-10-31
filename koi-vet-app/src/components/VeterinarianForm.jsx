import { Button, Image, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React from "react";
import ReactQuill from "react-quill";

const VeterinarianForm = ({ selectedUser, setSelectedUser, handleImageChange, image, isEditUser, serviceList }) => {
    console.log("selectedUser fss", selectedUser);
    return (
        <>
            <div className="mb-3 row">
                <div className="col-md-6">
                    <label className="">Full Name</label>
                    <input type="text" value={selectedUser?.fullName || ''} onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
                </div>
                <div className="col-md-6 ">
                    <label className="">Phone Number</label>
                    <input type="text" value={selectedUser?.veterinarian?.phone || ''} onChange={(e) => setSelectedUser({ ...selectedUser, veterinarian: { ...selectedUser.veterinarian, phone: e.target.value } })} />
                </div>

                <div className="col-md-6 mt-3">
                    <label className="">Username</label>
                    <input type="text" value={selectedUser?.username || ''} onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
                </div>
                <div className="col-md-6 mt-3">
                    {!isEditUser && <>
                        <label className="">Password</label>
                        <input type="text" value={selectedUser?.password || ''} onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })} />
                    </>}
                </div>
                <div className="col-md-6 mt-3">
                    <label className="">Email</label>
                    <input type="text" value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                </div>
                <div className="col-md-6 mt-3">
                    <label className="">Google Meet Link</label>
                    <input type="text" value={selectedUser?.veterinarian?.googleMeet || ''} onChange={(e) => setSelectedUser({ ...selectedUser, veterinarian: { ...selectedUser.veterinarian, googleMeet: e.target.value } })} />
                </div>
                <div className="col-md-12 mt-3">
                    <label className="">Service</label>
                    <Select
                        mode="multiple"
                        size="large"
                        placeholder="Please select"
                        value={selectedUser?.veterinarian?.listOfServices || []}
                        onChange={(value) => setSelectedUser({ ...selectedUser, veterinarian: { ...selectedUser.veterinarian, listOfServices: value } })}
                        style={{ width: '100%' }}
                        options={serviceList?.map((service) => ({ label: service?.serviceName, value: service?.serviceId }))}
                    />
                </div>
                <div className="col-md-12 mt-3">
                    <label htmlFor='description' className='form-label'>Description</label>
                    <ReactQuill
                        name='description'
                        id='description'
                        value={selectedUser?.veterinarian?.description || ''}
                        onChange={(value) => setSelectedUser({ ...selectedUser, veterinarian: { ...selectedUser.veterinarian, description: value } })}
                    />
                </div>
                <label htmlFor='image' className='form-label mt-3'>Image</label>
                <div className="d-flex flex-column gap-2 ">
                    <Image width={300} src={image ? URL.createObjectURL(image) : selectedUser?.veterinarian?.image} alt={selectedUser?.fullName} />
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
        </>)
        ;
}

export default VeterinarianForm;