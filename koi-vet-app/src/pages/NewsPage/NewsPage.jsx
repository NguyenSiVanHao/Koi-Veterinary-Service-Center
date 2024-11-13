import React, { useEffect, useState } from "react";
import { fetchAllNewsAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import './NewsPage.css';

import BannerTop from "../../components/BannerTop/BannerTop";
function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <BannerTop title="News" subTitle="Home / News" />
    <div className="container mx-auto px-4 py-8" style={{ justifyContent: "center", alignItems: "center"}}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8" style={{margin: "20px 0 0 0", color: "rgb(31, 43, 108)"}}><strong>News</strong></h1>
      </div>

      <div className="banner-container">
        <div className="banner-text">
          Welcome to the Koi & Pond Service News! Have a nice day!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{marginTop: "50px"}}>

        <div className="container news-container-news-page">
        {newsData.map(newsItem => (
          <div className="card news-card-news-page " key={newsItem.newId} style={{width: "500px"}}>
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 news-card-content"
            onClick={() => handleNewsClick(newsItem.newId)}
          >
            <img 
              src={newsItem.img} 
              alt={newsItem.newId} 
              className="w-full h-48 object-cover"
              width={800}
              height={300}
            />
            <div className="p-4">
              <h5 
                className="text-lg font-semibold mt-1"
                dangerouslySetInnerHTML={{ __html: newsItem.title }}
              />
              <div className="card-text text-muted" dangerouslySetInnerHTML={{ __html: newsItem.preview }}></div>
            </div>
          </div>
          </div> 
        ))}
        </div>
        </div>
    </div>
    </>
  );
}

export default NewsPage;
