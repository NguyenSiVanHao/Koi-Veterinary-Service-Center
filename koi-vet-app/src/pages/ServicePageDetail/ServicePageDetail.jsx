import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fecthServiceByServiceIdAPI, fetchAllRatingByServiceIdAPI } from "../../apis";
import "./ServicePageDetail.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import { Table } from "antd";

function ServicePageDetail() {
  const { serviceId } = useParams();
  console.log(serviceId);

  const [serviceDetail, setServiceDetail] = useState(null);
  const [ratings, setRatings] = useState([]);
  const fectchServiceDetail = async () => {
    const response = await fecthServiceByServiceIdAPI(serviceId);
    setServiceDetail(response.data);
  };

  useEffect(() => {
    const fetchRating = async () => {
      const response = await fetchAllRatingByServiceIdAPI(serviceId);
      setRatings(response.data);
    }
    fetchRating();
  }, [serviceId]);

  useEffect(() => {
    fectchServiceDetail();
  }, [serviceId]);

  if (!serviceDetail) {
    return <Loading />;
  }

  const getPrice = () => {
    if (serviceDetail.serviceFor === "FISH") {
      return `Price per fish: ${(serviceDetail.koiPrice).toLocaleString()} VND`;
    } else if (serviceDetail.serviceFor === "POND") {
      return `Price per pond: ${(serviceDetail.pondPrice).toLocaleString()} VND`;
    } else {
      return `Price for online: ${(serviceDetail.basePrice).toLocaleString()} VND`;
    }
  };

  const getServiceType = () => {
    if(serviceDetail.serviceFor !== "ONLINE"){
      return `Service Price: ${(serviceDetail.basePrice).toLocaleString()} VND`;
    }
  }

  const columns = [
    {
      title: "Rating",
      dataIndex: "star",
    },
    {
      title: "Feedback",
      dataIndex: "description",
    },
    {
      title: "Number",
      dataIndex: "number",
    }
  ]
  
  return (
    <Container fluid className="service-detail">
      <Row className="align-items-center service-row">
        {/* Left Side - Image */}
        <Col md={6} className="p-0">
          <Card className="border-0">
            <Card.Img
              src={serviceDetail.image}
              alt="Service"
              className="service-image"
            />
          </Card>
        </Col>

        {/* Right Side - Details */}
        <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
          <div className="p-4">
            <h1 className="service-title mb-4">{serviceDetail.serviceName}</h1>
            <h4>Service Description</h4>
            <div 
              className="service-description" 
              dangerouslySetInnerHTML={{ __html: serviceDetail.description }}
            />
            <p className="service-price">{getPrice()}</p>
            <p className="service-type">{getServiceType()}</p>
            <p>
              <strong>Service Type:</strong>{" "}
              <span><strong>{serviceDetail.serviceFor}</strong></span>
            </p>
            <p>Rating: {ratings.averageStar} ★</p>
            <Table columns={columns} dataSource={ratings} style={{color: "red"}} pagination={{pageSize: 5}}/>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ServicePageDetail;
