import React, { useEffect, useState } from "react";
import logo from "../../assets/img/logo.png";
import "../../pages/Home/Home.css";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Sử dụng NavLink để kiểm soát trạng thái "active"
import { useDispatch, useSelector } from "react-redux";
import { fetchLogoutAPI } from "../../apis";
import { clearUser, setIsAuthorized } from "../../store/userSlice";
import { ROLE } from "../../utils/constants";
import { toast } from "react-toastify";

function Header() {
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetchLogoutAPI();
      toast.success(response.data.message);
    } catch (error) {
      console.log("error", error)
    } finally {
      localStorage.removeItem("accessToken");
      await localStorage.removeItem("accessToken");
      await dispatch(clearUser());
      await dispatch(setIsAuthorized(false));
      navigate("/login");
    }

  };

  const handleButtonLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <>
      {/* Header Info */}
      <div className="header-info text-center py-3 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className=" text-start col-md-4">
              <Link to="/">
                <img src={logo} alt="logo" className="img-fluid" />
              </Link>
            </div>
            <div className="col-md-8 row justify-content-end">
              <div className="col-md-3 text-center">
                <i className="fas fa-phone-alt"></i>
                <div className="text">EMERGENCY</div>
                <div className="contact-info">(+84) 975-652-978</div>
              </div>
              <div className="col-md-3 text-center">
                <i className="fas fa-clock"></i>
                <div className="text">WORK HOUR</div>
                <div className="contact-info">7:00-11:00 && 13:00-17:00</div>
              </div>
              <div className="col-md-3 text-center">
                <i className="fas fa-map-marker-alt"></i>
                <div className="text">LOCATION</div>
                <div className="contact-info">FPT University HCM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Bootstrap */}
      <nav className="navbar navbar-expand-lg navbar-dark ">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Menu Links */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about-us" className="nav-link">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/services" className="nav-link">
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/veterinarians" className="nav-link">
                  Veterinarians
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/news" className="nav-link">
                  News
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link">
                  Contacts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/faq" className="nav-link">
                  FAQ
                </NavLink>
              </li>
            </ul>
            {/* User Actions */}
            <div className="d-flex">
              {isAuthorized ? (
                <button
                  className="btn btn-outline-light me-2"
                  type="button"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="btn btn-outline-light me-2"
                  type="button"
                  onClick={() => handleButtonLogin()}
                >
                  Login
                </button>
              )}
              {user?.role === ROLE.CUSTOMER &&
                <Link to="/profile" className="btn btn-outline-light">
                  <i className="fas fa-user"></i>
                </Link>}
              {[ROLE.VETERINARIAN, ROLE.STAFF,ROLE.MANAGER].includes(user?.role) &&
                <Link to={user?.role === ROLE.MANAGER ? "/admin" : "/admin/appointment"} className="btn btn-outline-light">
                  <i className="fas fa-user"></i>
                </Link>}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
