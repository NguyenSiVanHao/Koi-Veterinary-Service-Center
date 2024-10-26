import React, { useState } from "react";
import register from "../../assets/img/login_side.png";
import { createUserAPI } from "../../apis";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [repassword, setRepassword] = useState(""); // New state for repassword
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(email, password, username, fullname, phone, address);
    if (password !== repassword) { // Validate repassword
      toast.error("Repasswords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const response = await createUserAPI(email, password, username, fullname, phone, address);
      if (response?.data?.status === 201) {
        toast.success(response?.data?.message);
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
              <h2>Forgot Password</h2>
            </div>
          </div>
          <form action="#!" className="mx-5" onSubmit={handleSubmit}>
            {step === 1 &&
              <div className="row gy-2 overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" name="email" id="email" placeholder="abc@email.com" required onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                  </div>
                </div>
              </div>
            }

            <div className="row gy-2 overflow-hidden">
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    className="form-control"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password" className="form-label">
                    Password
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
                  <input type="password" className="form-control" name="repassword" id="repassword" value={repassword} placeholder="Re-enter Password" onChange={(e) => setRepassword(e.target.value)} required />
                  <label htmlFor="repassword" className="form-label">
                    Repassword
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="d-grid my-3">
                  <button className="btn-dark btn btn-lg" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "SIGN UP"}
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

export default ForgotPassword;
