import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsByIdAPI, fetchAllNewsAPI } from '../../apis';
import { Card, Input } from 'antd';
import { Col, Row } from 'react-bootstrap';
import './NewsDetailPage.css';

const { Search } = Input;

function NewsDetailPage() {
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [allNewsData, setAllNewsData] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const response = await fetchAllNewsAPI();
                setAllNewsData(response.data);
                setFilteredNews(response.data);
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
                if (err.response && err.response.status === 401) {
                    setError("Unauthorized access. Please log in again.");
                    // Optionally, redirect to login page
                    // navigate('/login');
                } else {
                    setError("Failed to fetch news data. Please try again later.");
                }
            }
        }
        fetchNewsById();
    }, [id]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = allNewsData.filter(news => 
            news.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredNews(filtered);
    };

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    if (!newsData) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    return (
        <>
        <h1 style={{margin: "50px 0 0 50px", color: "rgb(31, 43, 108)"}}><strong>News Detail</strong></h1>
        <div className="container mx-auto px-4 py-8" style={{margin: "100px 0 100px 250px"}}>
            <div className="flex flex-col lg:flex-row gap-8">
                <Row>
                    <Col lg={8}>
                        {/* Main Content */}
                        <div className="lg:w-2/3 card news-card-detail-page">
                            <img 
                                src={newsData.img} 
                                alt={newsData.title} 
                                className="w-full h-96 object-cover rounded-lg mb-6"
                                height={400}
                            />
                            <h1 
                                className="text-3xl font-bold mb-4"
                                dangerouslySetInnerHTML={{ __html: newsData.title }}
                            />
                                <div>
                            <p><strong>Content:</strong></p>
                            <div className="prose max-w-none">
                                <p dangerouslySetInnerHTML={{ __html: newsData.content }} />
                            </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            <Card style={{height: "500px"}}>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <h2 className="text-xl font-bold p-4 bg-gray-50">Recent Posts</h2>
                                    <div className="p-4">
                                        <Search
                                            placeholder="Search news"
                                            allowClear
                                            enterButton="Search"
                                            size="large"
                                            onSearch={handleSearch}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="divide-y max-h-96 overflow-y-auto scrollable-list" style={{ margin: "0 0 0 20px"}}>
                                        {filteredNews.map(news => (
                                            <div className="card news-card" style={{width: "300px"}}>
                                            <div 
                                                key={news.newId}
                                                className={`flex gap-4 p-3 cursor-pointer ${
                                                    news.newId === Number(id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => navigate(`/news/${news.newId}`)}
                                            >
                                                <div className='flex gap-4' style={{display: "flex", alignItems: "center"}}>
                                                <img 
                                                    src={news.img} 
                                                    alt={news.title} 
                                                    className="w-24 h-24 object-cover rounded"
                                                    width={40}
                                                    height={40}
                                                />
                                                <div className="flex-1">
                                                    <h7 
                                                        className="text-sm font-medium line-clamp-2"
                                                        dangerouslySetInnerHTML={{ __html: news.title }}
                                                    />
                                                    </div>  
                                                </div>
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
        <button className='btn btn-primary' type="primary" onClick={() => navigate('/news')}>Back to News</button>
        </>
    )
}

export default NewsDetailPage
