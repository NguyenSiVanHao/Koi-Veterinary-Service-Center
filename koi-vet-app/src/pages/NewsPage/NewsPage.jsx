import React, { useEffect, useState } from "react";
import { createNewsAPI, fetchAllNewsAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import { Card, Form, Image, Input, Upload} from "antd";
import ReactQuill from "react-quill";
import ImgCrop from "antd-img-crop";
import { toast } from "react-toastify";
import Modal from "antd/es/modal/Modal";
function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };


  const handleUploadImage = (file) => {
    setImg(file);
  };

  const handleSubmit = async (values) => {
    try {
      const data = { ...values, content };
      const response = await createNewsAPI(data, img);
      toast.success("News created successfully!");
      setNewsData([...newsData, response]);
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Title already exists. Please use a different title.");
      } else {
        console.error("Error creating news:", error);
        toast.error("Failed to create news. Please try again.");
      }
    }
  };
  

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetchAllNewsAPI();
        setNewsData(response.data);
      } catch (err) {
        setError("Failed to fetch news data. Please try again later.");
        console.error("Error fetching news data:", err);
      }
    };
    fetchNewsData();
  }, []);

  const handleNewsClick = (id) => {
    navigate(`/news/${id}`);
  };

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8" style={{ justifyContent: "center", alignItems: "center"}}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8" style={{margin: "20px 0 0 0", color: "rgb(31, 43, 108)"}}><strong>News</strong></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{marginTop: "100px"}}>

        <div className="container">
        {newsData.map(newsItem => (
          <div className="card news-card" style={{width: "800px"}}>
          <div 
            key={newsItem.newId}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => handleNewsClick(newsItem.newId)}
          >
            <img 
              src={newsItem.img} 
              alt={newsItem.newId} 
              className="w-full h-48 object-cover"
              width={800}
              height={300}
            />
            <div className="p-4" style={{backgroundColor: "#ececec"}}>
              <h4 
                className="text-lg font-semibold mt-1"
                dangerouslySetInnerHTML={{ __html: newsItem.title }}
              />
            </div>
          </div>
          </div> 
        ))}
        </div>
        </div>

        <Modal 
          open={isModalOpen} 
          onCancel={handleCloseModal}
          footer={null}
        >
          <p>Create News</p>
          <Form onFinish={handleSubmit} form={form}>
            <Form.Item name="title" rules={[{ required: true, message: "Please enter title" }]}>
              <Input placeholder="Enter title" rules={[{required: true}, {message: "Please enter title"}]}/>
            </Form.Item>

            <Form.Item name="preview" rules={[{required: true}, {message: "Please enter Preview"}]}>
              <Input placeholder="Enter Preview" rules={[{required: true}, {message: "Please enter Preview"}]}/>
            </Form.Item>
            
            <Form.Item
              label="Content"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please enter a description",
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                value={content} 
                onChange={setContent}
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "pls enter",
                },
              ]}
            >
              <div className="form-group mt-3 text-center">
              <Image width={250} className="w-100 koi-profile-image rounded-3" src={(img ? URL.createObjectURL(img) : img)} alt="Koi" />
                <button className="custom-file-upload" type="button">
                  <ImgCrop rotationSlider>
                    <Upload
                      listType="picture" // Giữ nguyên để chỉ tải lên một bức ảnh
                      beforeUpload={(file) => {
                        handleUploadImage(file); // Gọi handleImageChange với tệp
                        return false; // Ngăn không cho gửi yêu cầu tải lên
                      }}
                      showUploadList={false} // Ẩn danh sách tải lên
                    >
                      <div className="custom-file-upload p-0"> <i className="fa-solid fa-upload"></i> Upload</div>
                    </Upload>
                  </ImgCrop>
                </button>
              </div>
            </Form.Item>
            <Form.Item>
              <button className="btn btn-primary" type="submit">Create</button>
            </Form.Item>
          </Form>
        </Modal>
    </div>
    <button onClick={handleOpenModal} className="btn btn-primary" style={{margin: "0 0 0 10px"}}>Create News</button>
    </>
  );
}

export default NewsPage;
