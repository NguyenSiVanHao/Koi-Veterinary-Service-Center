import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchLogoutAPI } from "../../apis";
import logo_admin from "../../assets/img/admin_logo.png";
import { clearUser, setIsAuthorized } from "../../store/userSlice";
import { ROLE } from "../../utils/constants";
import "./SideBar.css";
import { toast } from "react-toastify";

function SideBar() {
  const isAuthorized = useSelector((state) => state?.user?.isAuthorized);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state) => state.user.role);

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

  return (
    <nav id="sidebar" className="col-md-2 col-lg-2 d-md-block sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <img src={logo_admin} alt="logo" className="img-fluid" />
        </Link>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>
        </li>

        {(role === ROLE.MANAGER || role === ROLE.STAFF) && (
          <li className="nav-item">
            <Link to="/admin/usermanagement" className={`nav-link ${location.pathname === '/admin/usermanagement' ? 'active' : ''}`}>
              <i className="fas fa-users"></i> Users
            </Link>
          </li>
        )}
        {(role === ROLE.VETERINARIAN || role === ROLE.STAFF) && (
          <li className="nav-item">
            <Link to="/admin/appointment" className={`nav-link ${location.pathname === '/admin/appointment' ? 'active' : ''}`}>
              <i className="far fa-calendar-alt"></i> All Appointments
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link to="/admin/servicemanagement" className={`nav-link ${location.pathname === '/admin/servicemanagement' ? 'active' : ''}`}>
            <i className="fas fa-cogs"></ i> Services Management
          </Link>
        </li>
        {(role === ROLE.MANAGER || role === ROLE.STAFF) && (
          <>
            <li className="nav-item">
              <Link to="/admin/schedual" className={`nav-link ${location.pathname === '/admin/schedual' ? 'active' : ''}`}>
                <i className="fas fa-calendar-alt"></i> Veterinarian Schedual
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/faqmanagement" className={`nav-link ${location.pathname === '/admin/faqmanagement' ? 'active' : ''}`}>
                <i className="fas fa-question-circle"></i> FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/homevisitprice" className={`nav-link ${location.pathname === '/admin/homevisitprice' ? 'active' : ''}`}>
                <i className="fas fa-home"></i> Home Visit Price
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/medicinelist" className={`nav-link ${location.pathname === '/admin/medicinelist' ? 'active' : ''}`}>
                <i className="fas fa-pills"></i> Medicine List
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/contactmanagement" className={`nav-link ${location.pathname === '/admin/contactmanagement' ? 'active' : ''}`}>
                <i className="fas fa-envelope"></i> Contact Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/newsmanagement" className={`nav-link ${location.pathname === '/admin/newsmanagement' ? 'active' : ''}`}>
                <i className="fas fa-newspaper"></i> News Management
              </Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="fas fa-cog"></i> Setting
          </Link>
        </li>
      </ul>
      {isAuthorized && (
        <div className="sidebar-logout">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default SideBar;
