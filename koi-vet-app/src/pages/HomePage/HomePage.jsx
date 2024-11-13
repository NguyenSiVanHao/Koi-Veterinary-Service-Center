import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../HomePage/HomePage.css"
import banner_home from "../../assets/img/banner_home.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, resetBoking, setBookingData } from '../../store/bookingSlice';
import { BOOKING_TYPE, ROLE } from '../../utils/constants';
import { fecthAllServicesAPI, fetchAllNewsAPI } from '../../apis';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';

function HomePage() {
    const dispatch = useDispatch();
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();
    const [serviceList, setServiceList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Khởi đầu từ slide thứ hai
    const [newsList, setNewsList] = useState([]);
    const fetchNewsList = async () => {
        const response = await fetchAllNewsAPI();
        setNewsList(response.data.slice(0, 4));
    }
    const getServiceList = async () => {
        const response = await fecthAllServicesAPI();
        setServiceList(response.data.slice(0, 6));
    }

    const handleBooking = (type) => {
        if(role === ROLE.CUSTOMER){
            dispatch(setBookingData({ type: type }))
            dispatch(nextStep())
            navigate('/booking')
        }else{
            toast.error("You are not allowed to book appointment with role: " + role)
        }
    }
    //reset booking data
    useEffect(() => {
        dispatch(resetBoking())
        getServiceList();
        fetchNewsList()
        //eslint-disable-next-line
    }, [])


    return (
        <>
            <section className="position-relative banner-section " >
                <div className="img-container">
                    <img src={banner_home}
                        alt="Hero" className="banner w-100 banner-i img-crop max-vh-30" />
                </div>
                <div className="container h-30">
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-light bg-opacity-75 d-flex align-items-center justify-content-start">
                        <div className="text-start text-dark container ">

                            <h1 className="display-4 fw-bold mb-4 text-start text-nav" >Dedicated Care for Koi Fish</h1>
                            <h1 className="display-4 fw-bold mb-4 text-start text-nav" >Ensuring Their Peak Health</h1>
                            <button className="btn btn-primary" onClick={() => navigate('/services')}>Our Services</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="min-vh-50 bg-light">

                <div className="container px-6 py-5">
                    <div className="row">

                        <div className="col-md-4 mb-4" onClick={() => handleBooking(BOOKING_TYPE.HOME)}>
                            <div className="service-card bg-blue-100 hover:bg-blue-200 p-4 rounded-lg shadow-md">
                                <div className="text-center-custom text-center">
                                    <i className="fas fa-home text-4xl mb-4 text-primary"></i>
                                    <h3 className="h5 font-weight-semibold mb-2">Booking Home Service</h3>
                                    <p className="text-gray-600">Book a home service for convenient healthcare at your doorstep.</p>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-4 mb-4" onClick={() => handleBooking(BOOKING_TYPE.ONLINE)}>
                            <div className="service-card bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md">
                                <div className="text-center-custom text-center">
                                    <i className="fas fa-video text-4xl mb-4 text-success"></i>
                                    <h3 className="h5 font-weight-semibold mb-2">Online Consultation</h3>
                                    <p className="text-gray-600">Connect with healthcare professionals through online video consultations.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" onClick={() => handleBooking(BOOKING_TYPE.CENTER)}>
                            <div className="service-card bg-purple-100 hover:bg-purple-200 p-4 rounded-lg shadow-md">
                                <div className="text-center-custom text-center">
                                    <i className="fas fa-hospital text-4xl mb-4 text-info"></i>
                                    <h3 className="h5 font-weight-semibold mb-2">Booking Service at Center</h3>
                                    <p className="text-gray-600">Schedule an appointment at our healthcare center for in-person services.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="h4 text-center-custom text-center text-gray-800 mt-5">A Great Place to Receive Care</h2>
                    <p className="text-center-custom text-center text-gray-600 mb-4">Our expert team is dedicated to ensuring the health and longevity of your beloved Koi through personalized, state-of-the-art medical services. Trust us to provide the best care, because at KOIMED, we care as much about your Koi as you do.</p>
                    <div className="text-center-custom text-center">
                        {/* <a href="#" className="btn btn-primary">Learn More</a> */}
                        <Link to="/about-us" className="btn btn-primary">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>




            <div className="container py-5">
                <h6 className="text-center text-uppercase text-primary mb-2">Care you can believe in</h6>
                <h2 className="text-center mb-5">Our Services</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className="list-group">
                            {serviceList.map((service, index) => {
                                let isActive = currentIndex === index;
                                return (
                                    <Link key={service.id} onClick={() => setCurrentIndex(index)} className={`list-group-item list-group-item-action service-item ${isActive ? 'active' : ''} py-3`}>
                                        {service.serviceFor === "FISH" && <i className="fas fa-fish service-icon me-3"></i>}
                                        {service.serviceFor === "POND" && <i className="fas fa-tint service-icon me-3"></i>}
                                        {service.serviceFor === "ONLINE" && <i className="fas fa-heartbeat service-icon me-3"></i>}
                                        {service.serviceName}
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="mt-4">
                            <Link to="/services">
                                <button className="btn btn-primary w-100">View All</button>
                            </Link>

                        </div>
                    </div>
                    <div className="col-md-8">
                        <Carousel activeIndex={currentIndex} onSelect={(index) => setCurrentIndex(index)} interval={1500}>
                            {serviceList.map((service) => (
                                <Carousel.Item key={service.serviceId}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="col-md-12">
                                                <h4>{service.serviceName}</h4>
                                                <div dangerouslySetInnerHTML={{ __html: service.description }} />
                                            </div>
                                            <img
                                                src={service.image}
                                                alt={service.serviceName}
                                                className="img-fluid rounded service-home-img"
                                            />
                                        </div>

                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
            <div className="container my-4">
                <div className="row">
                    <h6 className="text-center-custom text-center text-uppercase text-primary mb-2">Better information, Better health</h6>
                    <h2 className="text-center-custom text-center mb-5 text-nav" >News</h2>
                    {newsList.map((news) => {
                        return (
                            <div className="col-md-6 mb-4" onClick={() => navigate(`/news/${news.newId}`)}>
                                <div className="card news-card" onclick="console.log('Clicked on article: Popular koi varieties and their characteristics')">
                                    <img src={news.img} className="card-img-top" alt={news.title} />
                                    <div className="card-body">
                                        <div className="card-title" dangerouslySetInnerHTML={{ __html: news.title }}></div>
                                        <div className="card-text text-muted" dangerouslySetInnerHTML={{ __html: news.preview }}></div>
                                        <div className="d-flex align-items-center">
                                            <span className="mr-2">
                                                <i className="fas fa-eye text-primary"></i> 68
                                            </span>
                                            <span>
                                                <i className="fas fa-heart text-danger"></i> 86
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>


            <section className="py-5 bg-light">

                <div className="container">
                    <h6 className="text-center-custom text-center text-uppercase text-primary mb-2">Care you can believe in</h6>
                    <h2 className="text-center-custom text-center mb-5">Our Services</h2>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="card text-center-custom text-center h-100">
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-solid fa-phone"></i></div>
                                    <h3 className="card-title">Phone </h3>
                                    <p className="card-text">(+84) 975-652-978</p>
                                    <p className="card-text">(+84) 5599-136-901</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center-custom text-center h-100">
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-solid fa-location-dot"></i></div>
                                    <h3 className="card-title">Location</h3>
                                    <p className="card-text">FPT University HCM</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3  ">
                            <div className="card text-center-custom text-center h-100  ">
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-regular fa-envelope"></i></div>
                                    <h3 className="card-title">EMAIL</h3>
                                    <p className="card-text">koicenter.swp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3 " >
                            <div className="card text-center-custom text-center h-100" >
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-regular fa-clock"></i></div>
                                    <h3 className="card-title">Working Hours</h3>
                                    <p className="card-text">7:00-11:00 AM</p>
                                    <p className="card-text">13:00-17:00 PM</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage