import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsByIdAPI, fetchAllNewsAPI } from '../../apis';
import { Card } from 'antd';
import { Col, Row } from 'react-bootstrap';
import './NewsDetailPage.css';

function NewsDetailPage() {
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [allNewsData, setAllNewsData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const response = await fetchAllNewsAPI();
                setAllNewsData(response.data);
            } catch (err) {
                console.error("Error fetching all news:", err);
            }
        };
        fetchAllNews();
    }, []);

    useEffect(() => {
        const fetchNewsById = async () => {
            try {
                console.log("Fetching news with id:", id);
                const response = await fetchNewsByIdAPI(id);
                console.log("API response:", response);
                if (response && response.data) {
                    setNewsData(response.data);
                } else {
                    setError("No data received from the API");
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to fetch news data. Please try again later.");
            }
        }
        fetchNewsById();
    }, [id]);

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    if (!newsData) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <Row>
                    <Col lg={8}>
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                    <img 
                        src={newsData.img} 
                        alt={newsData.title} 
                        className="w-full h-96 object-cover rounded-lg mb-6"
                    />
                    <h1 
                        className="text-3xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: newsData.title }}
                    />
                    <div className="prose max-w-none">
                        <p dangerouslySetInnerHTML={{ __html: newsData.content }} />
                    </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                        <Card>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <h2 className="text-xl font-bold p-4 bg-gray-50">Recent Posts</h2>
                                <div className="divide-y max-h-60 overflow-y-auto scrollable-list"> {/* Thêm chiều cao tối đa và cuộn */}
                                    {allNewsData.map(news => (
                                        <div 
                                            key={news.newId}
                                            className={`flex gap-4 p-3 cursor-pointer ${
                                                    news.newId === Number(id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => navigate(`/news/${news.newId}`)}
                                            >
                                                <img 
                                                    src={news.image} 
                                                    alt={news.title} 
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            <div className="flex-1">
                                                <h3 
                                                    className="text-sm font-medium line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: news.title }}
                                                />
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default NewsDetailPage
