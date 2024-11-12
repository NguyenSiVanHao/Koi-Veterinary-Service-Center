import React from "react";
import admin_logo from "../../assets/img/admin_logo.png";
import "../../pages/Home/Home.css"
import "./Footer.css"
function Footer() {
  return (
    <>
      <footer className="footer text-center">
        <div className="container" >
        <div className="row">
          <div className="col-md-3 text-start">
            <div className="footer-logo">
            <img src={admin_logo} alt="logo" />
            <p>Leading the Way in Medical Excellence, Trusted Care.</p>
            </div>
          </div>
          <div className="col-md-3 text-start">
            <h4>Contact Us</h4>
            <p>
              Call: (+84) 975-652-978 <br/>Email: 
              koicenter.swp@gmail.com <br/> 
              Address: FPT University HCM
            </p>
          </div>
          <div className="col-md-3 text-start">
            <h4>Mail</h4>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                aria-label="Email"
              />
              <button className="btn btn-submit border border-white" type="button">
                <i className="fas fa-paper-plane text-white  "></i>
              </button>
            </div>
          </div>

          <div className="col-md-3 text-start text-center">
            <h4>Follow Us</h4>
            <p>Stay connected with us on social media.</p>
            <p className="d-flex justify-content-center gap-3">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </p>
          </div>
        </div>
        </div>
        <hr />
        <p className="mt-4 align-content-center mb-0 pb-4">
          © 2024 Hospital's Name All Rights Reserved by PNTEC-LTD
        </p>
        
      </footer>
    </>
  );
}

export default Footer;
