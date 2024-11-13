import React, { useEffect, useState } from 'react';
import './HomeVisitPriceTable.css'; // Import CSS cho component
import { fetchHomeVisitPriceAPI } from '../../apis';

const HomeVisitPriceTable = () => {
  // Dữ liệu mẫu (thay thế bằng dữ liệu thực từ API)
  const [homeVisitPrice, setHomeVisitPrice] = useState([]);

  useEffect(() => {
    const fetchHomeVisitPrice = async () => {
      const response = await fetchHomeVisitPriceAPI();
      setHomeVisitPrice(response.data);
    };
    fetchHomeVisitPrice();
  }, []);

  // Sắp xếp dữ liệu theo fromPlace và toPlace
  const sortedHomeVisitPrice = [...homeVisitPrice].sort((a, b) => {
    if (a.fromPlace < b.fromPlace) return -1;
    if (a.fromPlace > b.fromPlace) return 1;
    if (a.toPlace < b.toPlace) return -1;
    if (a.toPlace > b.toPlace) return 1;
    return 0;
  });

  return (
    <div className="delivery-pricing-table">
      <h3 className="delivery-pricing-title booking-title fw-bold">Home Visit Pricing Table</h3>
      <table className="delivery-pricing-table-content table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>From (km)</th>
            <th>To (km)</th>
            <th>Price (VND/km)</th>
          </tr>
        </thead>
        <tbody>
          {sortedHomeVisitPrice.map((delivery, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{delivery.fromPlace}</td>
              <td>{delivery.toPlace}</td>
              <td>{delivery.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeVisitPriceTable;
