import React, { useEffect, useState } from 'react'
import { fecthAllServicesAPI } from '../../apis';
import { Card, Col, Container, Row } from 'react-bootstrap';
import KoiVet from '../../assets/img/KoiVet.jpg';
import './AboutUsPage.css';
import BannerTop from '../../components/BannerTop/BannerTop';

function AboutUsPage() {
    const [services, setServices] = useState([]);
    

    useEffect(() => {
    const fetchAboutUsAPI = async () => {
        const response = await fecthAllServicesAPI();
        setServices(response.data);
    }
        fetchAboutUsAPI();
    }, []);


  return (
    <>
   <BannerTop title="About Us" subTitle="Home / About Us" />
    <Container fluid className="service-detail">
      <Row className="align-items-center service-row">
        <Col md={6} className="p-0">
          <Card className="border-0">
            <Card.Img
              src= {KoiVet}
              alt="Service"
              className="service-image"
              style={{width: "100%", height: "800px"}}
            />
          </Card>
        </Col>

        {/* Right Side - Details */}
        <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
          <div className="p-4">
            <h4 style={{color: "var(--color-secondary)"}}><strong>Welcome to KoiMed</strong></h4>
            <h2 style={{color: "#1F2B6C"}}><strong>Best Care for Your Koi Health</strong></h2>
            
            {/* New code for displaying services in two columns */}
            <Row>
              {services.map((service, index) => (
                <Col key={service.id || index} md={6}>
                  <p><i class="bi bi-heptagon-fill  custom-blue-dot"></i> {service.serviceName}</p>
                </Col>
              ))}
            </Row>

            <p><strong>
                At our core, we are passionate about the well-being of koi fish. With years of expertise in aquatic care, 
                we aim to provide specialized services designed to keep your koi vibrant, healthy, and thriving. 
                Whether you are a beginner or a seasoned enthusiast, our goal is to support you at every step of your koi care journey.
            </strong></p>
    
            <p><strong>
                From water quality management to disease prevention and treatment, our team of dedicated 
                professionals understands the delicate nature of koi health. We offer tailored health assessments,
                medical consultations, and expert advice to ensure your pond ecosystem remains balanced and your koi live long, stress-free lives.
            </strong></p>
            
            <p><strong>
                Our commitment to koi health is not just about maintaining fish-it’s about creating an environment
                where beauty, harmony, and well-being flourish together. Thank you for trusting us with your koi's care. 
                Together, let's nurture a vibrant and healthy pond community.
            </strong></p>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default AboutUsPage
