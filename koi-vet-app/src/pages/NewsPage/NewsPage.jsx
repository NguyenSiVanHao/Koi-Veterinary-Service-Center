import React, { useEffect, useState } from "react";
import { fetchAllNewsAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.map(newsItem => (
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
              height={400}
            />
            <div className="p-4">
              <h3 
                className="text-lg font-semibold mt-1"
                dangerouslySetInnerHTML={{ __html: newsItem.title }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
