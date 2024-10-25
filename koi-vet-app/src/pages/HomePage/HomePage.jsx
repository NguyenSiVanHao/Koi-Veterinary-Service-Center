import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../HomePage/HomePage.css"
import banner_home from "../../assets/img/banner_home.jpg";
import { useDispatch } from 'react-redux';
import { nextStep, resetBoking, setBookingData } from '../../store/bookingSlice';
import { BOOKING_TYPE } from '../../utils/constants';

function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleBooking = (type) => {
        dispatch(setBookingData({ type: type }))
        dispatch(nextStep())
        navigate('/booking')
    }
    //reset booking data
    useEffect(() => {
        dispatch(resetBoking())
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
                        <Link href="#" className="btn btn-primary">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>




            <div className="container">

                <div className="container py-5">
                    <h6 className="text-center-custom text-center text-uppercase text-primary mb-2">Care you can believe in</h6>
                    <h2 className="text-center-custom text-center mb-5">Our Services</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="list-group">
                                <Link href="#" className="list-group-item list-group-item-action service-item active py-3">
                                    <i className="fas fa-tint service-icon me-3"></i>
                                    Free Checkup
                                </Link>
                                <Link href="#" className="list-group-item list-group-item-action service-item py-3">
                                    <i className="fas fa-heartbeat service-icon me-3"></i>
                                    Aquatic Telehealth Consult
                                </Link>
                                <Link href="#" className="list-group-item list-group-item-action service-item py-3">
                                    <i className="fas fa-fish service-icon me-3"></i>
                                    Fish Surgery
                                </Link>
                                <Link href="#" className="list-group-item list-group-item-action service-item py-3">
                                    <i className="fas fa-tint service-icon me-3"></i>
                                    Blood Bank
                                </Link>
                            </div>
                            <div className="mt-4">
                                <Link to="/services">
                                    <button className="btn btn-primary w-100">View All</button>
                                </Link>

                            </div>
                        </div>
                        <div className="col-md-8">
                            <h4>Test quality water</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare
                                ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit
                                nascetur proin massa in. Consequat faucibus porttitor enim et.</p>
                            <img src="https://images.pexels.com/photos/3104694/pexels-photo-3104694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Water quality test" className="img-fluid rounded mt-3" />
                        </div>
                    </div>
                </div>


                <div className="container my-4">
                    <div className="row">
                        <h6 className="text-center-custom text-center text-uppercase text-primary mb-2">Better information, Better health</h6>
                        <h2 className="text-center-custom text-center mb-5 text-nav" >News</h2>

                        <div className="col-md-6 mb-4">
                            <div className="card news-card" onclick="console.log('Clicked on article: Popular koi varieties and their characteristics')">
                                <img src="https://images.pexels.com/photos/27155971/pexels-photo-27155971/free-photo-of-d-ng-v-t-ca-d-i-n-c-trang-tri.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-img-top" alt="Popular koi varieties and their characteristics" />
                                <div className="card-body">
                                    <h5 className="card-title">Popular koi varieties and their characteristics</h5>
                                    <p className="card-text text-muted">Monday 05, September 2021 | By Author</p>
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

                        <div className="col-md-6 mb-4">
                            <div className="card news-card" onclick="console.log('Clicked on article: Koi health care and disease management.')">
                                <img src="https://canhquansanvuonxanh.com/wp-content/uploads/2023/02/ca-koi-dat-nhat-the-gioi-1.jpg" className="card-img-top" alt="Koi health care and disease management." />
                                <div className="card-body">
                                    <h5 className="card-title">Koi health care and disease management.</h5>
                                    <p className="card-text text-muted">Monday 05, September 2021 | By Author</p>
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

                        <div className="col-md-6 mb-4">
                            <div className="card news-card" onclick="console.log('Clicked on article: Koi breeding and genetics.')">
                                <img src="https://image-us.eva.vn/upload/3-2022/images/2022-08-26/image16-1661495517-88-width2048height1365.jpg" className="card-img-top" alt="Koi breeding and genetics." />
                                <div className="card-body">
                                    <h5 className="card-title">Koi breeding and genetics.</h5>
                                    <p className="card-text text-muted">Monday 05, September 2021 | By Author</p>
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

                        <div className="col-md-6 mb-4">
                            <div className="card news-card" onclick="console.log('Clicked on article: Koi Fish Care')">
                                <img src="https://toigingiuvedep.vn/wp-content/uploads/2021/01/hinh-anh-ca-koi-dep-nhat.jpg" className="card-img-top" alt="Koi Fish Care" />
                                <div className="card-body">
                                    <h5 className="card-title">Koi Fish Care</h5>
                                    <p className="card-text text-muted">Monday 05, September 2021 | By Author</p>
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
                    </div>
                </div>


                <div className="d-flex justify-content-center mt-4">
                    <div className="dot bg-primary mr-2"></div>
                    <div className="dot bg-light mr-2"></div>
                    <div className="dot bg-light"></div>
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
                                    <p className="card-text">(237) 666-331-894</p>
                                    <p className="card-text">(237) 681-812-255</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center-custom text-center h-100">
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-solid fa-location-dot"></i></div>
                                    <h3 className="card-title">Location</h3>
                                    <p className="card-text">HO CHI MINH  CITY </p>
                                    <p className="card-text">HA NOI CITY </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3  ">
                            <div className="card text-center-custom text-center h-100  ">
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-regular fa-envelope"></i></div>
                                    <h3 className="card-title">EMAIL</h3>
                                    <p className="card-text">fildineeesoe@gmil.com</p>
                                    <p className="card-text">myebstudios@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3 " >
                            <div className="card text-center-custom text-center h-100" >
                                <div className="card-body">
                                    <div className="display-4 mb-4"><i className="fa-regular fa-clock"></i></div>
                                    <h3 className="card-title">Working Hours</h3>
                                    <p className="card-text">Mon-Sat 09:00-20:00</p>
                                    <p className="card-text">Sunday Emergency only</p>

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