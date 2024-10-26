import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { createNewsAPI, deleteNewsAPI, fetchAllNewsAPI, updateNewsAPI } from "../../apis";
import { toast } from "react-toastify";
import { Button, Image, Modal, Upload } from "antd";
import ReactQuill from "react-quill";
import ImgCrop from "antd-img-crop";
import news_default from "../../assets/img/news_default.png";

function NewsManagement() {
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (file) => {
        setImage(file);
    }
    const handleEdit = (news) => {
        setSelectedNews(news);
        setIsModalOpen(true);
    }
    const handleCreate = () => {
        setIsCreate(true);
        setSelectedNews(null);
        setImage(null);
        setIsModalOpen(true);
    }
    const fetchAllNews = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAllNewsAPI();
            setNewsList(response?.data);
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleCancel = () => {
        setSelectedNews(null);
        setImage(null);
        setIsModalOpen(false);
    }
    const handleUpdateNews = async () => {
        try {
            const response = await updateNewsAPI(selectedNews?.newId, selectedNews, image);
            if (response?.status === 200) {
                toast.success(response?.message);
                fetchAllNews();
                setSelectedNews(null);
                setImage(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsModalOpen(false);
            setIsLoading(false);
        }
    }
    const handleCreateNews = async () => {
        try {
            setIsLoading(true);
            await setSelectedNews(null);
            const response = await createNewsAPI(selectedNews, image);
            if (response?.status === 200) {
                toast.success(response?.message);
                fetchAllNews();
                setSelectedNews(null);
                setImage(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
            setIsCreate(false);
            setIsModalOpen(false);
        }
    }
    const handleDeleteNews = async (newsId) => {
        try {
            Modal.confirm({
                title: "Are you sure you want to delete this news?",
                onOk: async () => {
                    const response = await deleteNewsAPI(newsId);
                    if (response?.status === 200) {
                        toast.success(response?.message);
                        fetchAllNews();
                    }
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }
    useEffect(() => {
        fetchAllNews();
    }, []);
    return (
        <div>
            <AdminHeader title="News Management" />
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between my-4">
                        <input type="text" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Preview</th>
                                <th>Content</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList?.filter((news) => news?.title?.toLowerCase()?.includes(search?.toLowerCase())).map((news) => (
                                <tr>
                                    <td>
                                        <div dangerouslySetInnerHTML={{ __html: news.title }} />
                                    </td>
                                    <td>
                                        <div dangerouslySetInnerHTML={{ __html: news.preview }} />
                                    </td>
                                    <td>
                                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
                                    </td>
                                    <td>
                                        <div className="d-flex flex-row gap-2 ">
                                            <button className="btn btn-primary" onClick={() => handleEdit(news)}>Edit</button>
                                            <button className="btn btn-danger " onClick={() => handleDeleteNews(news?.newId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-start">
                        <button className="btn btn-primary" onClick={() => handleCreate()}>Create news +</button>
                    </div>
                    <Modal open={isModalOpen} onCancel={() => handleCancel()} onOk={() => { isCreate ? handleCreateNews() : handleUpdateNews() }}>
                        <div className='mb-3'>
                            <label htmlFor='title'>Title</label>
                            <ReactQuill
                                name='question'
                                id='title'
                                value={selectedNews?.title || null}
                                onChange={(value) => setSelectedNews(prevState => ({ ...prevState, title: value }))}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='preview'>Preview</label>
                            <ReactQuill
                                name='preview'
                                id='preview'
                                value={selectedNews?.preview || null}
                                onChange={(value) => setSelectedNews(prevState => ({ ...prevState, preview: value }))}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='content'>Content</label>
                            <ReactQuill
                                name='content'
                                id='content'
                                value={selectedNews?.content || null}
                                onChange={(value) => setSelectedNews(prevState => ({ ...prevState, content: value }))}
                            />
                        </div>
                        <div className='mb-3 d-flex flex-column'>
                            <label htmlFor='image'>Image</label>
                            <Image width={300} src={image ? URL.createObjectURL(image) : (selectedNews?.img || news_default)} alt="news images" />
                            <div style={{ width: '300px' }}>
                                <Button className='mt-2 p-3 mx-6'>
                                    <ImgCrop rotationSlider aspect={16 / 9}>
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
                                    </ImgCrop>
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default NewsManagement;
