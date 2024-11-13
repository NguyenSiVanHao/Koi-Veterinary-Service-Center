import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fecthServiceByServiceIdAPI, fetchAllRatingByServiceIdAPI, fetchAllRatingByServiceIdAPI2 } from "../../apis";
import "./ServicePageDetail.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import { Table } from "antd";

function ServicePageDetail() {
  const { serviceId } = useParams();
  console.log(serviceId);

  const [serviceDetail, setServiceDetail] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratings2, setRatings2] = useState([]);


  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetchAllRatingByServiceIdAPI(serviceId);
        console.log("average Star :", response.data);
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setRatings([]);
      }
    }
    fetchRating();
  }, [serviceId]);

  useEffect(() => {
    const fetchRating2 = async () => {
      const response = await fetchAllRatingByServiceIdAPI2(serviceId);
      setRatings2(response.data);
      console.log("rating", response.data)
    }
    fetchRating2();
  }, [serviceId]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      const response = await fecthServiceByServiceIdAPI(serviceId);
      setServiceDetail(response.data);
    }
    fetchServiceDetail();
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
      title: "Image",
      dataIndex: ["userResponse", "image"],
      key: "userResponse.image",
      render: (image) => <img src={image} alt="Feedback" width={50} height={50} />,
    },
    {
      title: "Name",
      dataIndex: ["userResponse", "username"],
      key: "userResponse.username",
    },
    {
      title: "Rating",
      dataIndex: "star",
      key: "star",
      render: (star) => `${star} ★`,
    },
    {
      title: "Feedback",
      dataIndex: "description",
      key: "description",
    },
  ]
  
  return (
    <Container fluid className="service-detail">
      <Row className="align-items-center service-row">
        {/* Left Side - Image */}
        <Col md={6} className="p-0">
          <Card className="border-0" style={{height: "1000px"}}>
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
            <p>Rating: {ratings.averageStar ? `${ratings.averageStar.toFixed(1)} ★` : "0 ★"}</p>
            <p>Number of feedback: {ratings.number ? ratings.number : 0}</p>
            <Table 
              columns={columns} 
              dataSource={Array.isArray(ratings2) ? ratings2 : []} 
              pagination={{pageSize: 5}}
              rowKey="feedbackId"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ServicePageDetail;
