import React, { useState } from "react";
import register from "../../assets/img/login_side.png";
import { changePasswordAPI, createUserAPI } from "../../apis";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // New state for repassword
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(username, oldPassword, newPassword, confirmPassword);
    if(newPassword !== confirmPassword){
      toast.error("New password and confirm password do not match");
      setIsLoading(false);
      return;
    }
    try {
      const response = await changePasswordAPI(username, oldPassword, newPassword);
      if (response?.status === 200) {
        toast.success("Change password successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="row">
        <div className="col-md-6">
          <img src={register} alt="login" className="img-fluid" />
        </div>
        <div className="col-md-6 justify-content-center align-items-center login-left text-center mx-auto my-auto">
          <div className="col-md-8 login-container  my-15">
            <div className="d-grid gap-2 mb-4">
              <h2>Change Password</h2>
            </div>
          </div>
          <form action="#!" className="mx-5" onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="username" id="username" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                  </div>
            <div className="row gy-2 overflow-hidden">
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    className="form-control"
                    name="password"
                    id="oldPassword"
                    value={oldPassword}
                    placeholder="Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="oldPassword" className="form-label">
                    Old Password
                  </label>
                  <span
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    style={{ cursor: 'pointer', position: 'absolute', right: '15px', top: '17px' }} // Position the icon
                  >
                    {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>} {/* Show/hide icon */}
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" name="newPassword" id="newPassword" value={newPassword} placeholder="Re-enter Password" onChange={(e) => setNewPassword(e.target.value)} required />
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                    </label>
                </div>
              </div>
              <div className="col-12">
                <div className="d-grid my-3">
                  <button className="btn-dark btn btn-lg" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "CHANGE PASSWORD"}
                  </button>
                </div>
              </div>
              <div className="col-12">
                <p className="m-0 text-secondary text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="link-dark text-decoration-underline">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
