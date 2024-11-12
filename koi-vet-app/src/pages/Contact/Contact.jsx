import React, {  useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import "./Contact.css"
import { Card } from 'antd'
import { createContactAPI } from '../../apis';
import BannerTop from '../../components/BannerTop/BannerTop';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        alert("Vui lòng nhập email hợp lệ.");
        return;
    }

    try {
        await createContactAPI(formData);
        // Reset form after successful submission
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
        alert("Message sent successfully!");
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
    <BannerTop title="Contact Us" subTitle="Home / Contact us" />
    <Container fluid className="service-detail mt-5">
    <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.61001089798!2d106.80501207961838!3d10.84112756175228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1729741003391!5m2!1sen!2s" 
            width="100%" 
            height="450" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="FPT University HCMC Map"
          />
      <Row className="align-items-center service-row">
        {/* Left Side - Image */}
        <Col md={6} className="p-0">
            <h5 style={{color: "var(--color-secondary)"}}><strong>GET IN TOUCH</strong></h5>
            <h1 style={{color: "#1F2B6C"}}><strong>Contact</strong></h1>
            <form className="contact-form" style={{marginBottom: "20px"}} onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-form-col">
                  <div className="contact-form-group">
                    <label className="contact-form-label" htmlFor="name">Name</label>
                    <input
                      className="contact-form-input"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="contact-form-col">
                  <div className="contact-form-group">
                    <label className="contact-form-label" htmlFor="email">Email</label>
                    <input
                      className="contact-form-input"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="subject">Subject</label>
                <input
                  className="contact-form-input"
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="message">Message</label>
                <textarea
                  className="contact-form-textarea"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button className="contact-form-button" type="submit">SUBMIT</button>
            </form>
        </Col>

        {/* Right Side - Details */}
        <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
        <div className='contact-card-container' style={{textAlign: "center"}}>
            <Row>
                <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
                    <Card className='contact-card'>
                    <i class="bi bi-telephone contact-icons"></i>
                    <h2>EMERGENCY</h2>
                    <p>(+84) 975-652-978</p>
                    <p>(+84) 5599-136-901</p>
                    </Card>
                </Col>

                <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
                    <Card className='contact-card'>
                    <i class="bi bi-geo-alt contact-icons"></i>
                    <h2>LOCATION</h2>
                    <p>FPT University HCM</p>
                    </Card>
                </Col>
                    </Row>  
                <Row>
                <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
                    <Card className='contact-card'>
                    <i class="bi bi-envelope contact-icons"></i>
                    <h2>EMAIL</h2>
                    <p>
                    koicenter.swp@gmail.com</p>
                    </Card>
                </Col>

                <Col md={6} className="service-info" style={{backgroundColor: "#f8f9fa"}}>
                <Card className='contact-card'>
                <i class="bi bi-clock contact-icons"></i>
                <h2>WORKING HOURS</h2>
                <p>7:00-11:00 AM</p>
                <p>13:00-17:00 PM</p>
                </Card>
                </Col>
            </Row>
        </div>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default Contact
