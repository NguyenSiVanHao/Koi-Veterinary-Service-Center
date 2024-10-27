import { Button, Image, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react'
import ReactQuill from 'react-quill';


const ServiceForm = ({ selectedService, setSelectedService, setSelectedImage, selectedImage }) => {


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedService({ ...selectedService, [name]: value });
    }

    const handleImageChange = (file) => {
        setSelectedImage(file); // Cập nhật state với tệp ảnh
    }

    return (
        <div >
            <form>
                <div className='mb-3'>
                    <label htmlFor='serviceName' className='form-label'>Service Name</label>
                    <input name='serviceName' type='text' className='form-control' id='serviceName' value={selectedService?.serviceName} onChange={handleChange} />
                    <div className='mb-3 d-flex flex-column'>
                        <label htmlFor='image' className='form-label'>Image</label>

                        <Image width={300} src={selectedImage ? URL.createObjectURL(selectedImage) : selectedService?.image} alt={selectedService?.serviceName} />
                        <div style={{ width: '300px' }}>
                            <Button className='mt-2 p-3 mx-6'>
                                <ImgCrop rotationSlider>
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



                        {/* <img className='img-fluid' src={selectedImage ? URL.createObjectURL(selectedImage) : selectedService?.image} alt={selectedService?.serviceName} /> */}

                    </div>
                    <label htmlFor='serviceFor' className='form-label'>Service For</label>
                    <select name='serviceFor' className='form-select' id='serviceFor' value={selectedService?.serviceFor} onChange={handleChange}>
                        <option value='KOI'>Koi</option>
                        <option value='POND'>Pond</option>
                        <option value='ONLINE'>Online</option>
                    </select>
                    <label htmlFor='basePrice' className='form-label'>Base Price</label>
                    <input name='basePrice' type='number' className='form-control' id='basePrice' value={selectedService?.basePrice} onChange={handleChange} />
                    {
                        selectedService?.serviceFor === 'FISH' && (
                            <>
                                <label htmlFor='koiPrice' className='form-label'>Koi Price</label>
                                <input name='koiPrice' type='number' className='form-control' id='koiPrice' value={selectedService?.koiPrice} onChange={handleChange} />
                            </>
                        )
                    }
                    {
                        selectedService?.serviceFor === 'POND' && (
                            <>
                                <label htmlFor='pondPrice' className='form-label'>Pond Price</label>
                                <input name='pondPrice' type='number' className='form-control' id='pondPrice' value={selectedService?.pondPrice} onChange={handleChange} />
                            </>
                        )
                    }
                    <label htmlFor='description' className='form-label'>Description</label>
                    <ReactQuill
                        name='description'
                        id='description'
                        value={selectedService?.description}
                        onChange={(value) => setSelectedService({ ...selectedService, description: value })}
                    />
                </div>
            </form >
        </div >
    )
}

export default ServiceForm
