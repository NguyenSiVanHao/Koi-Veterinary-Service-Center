import React, { useEffect, useState } from "react";
import "./Login.css";
import logo from "../../assets/img/logo.png";
import logim_side from "../../assets/img/login_side.png";
import { toast } from "react-toastify";
import { fetchLoginAPI, fetchLogoutAPI } from "../../apis";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setIsAuthorized } from "../../store/userSlice";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { API_ROOT } from "../../utils/constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isAuthorized = useSelector(state => state?.user?.isAuthorized)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
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
      }
    };
    if (isAuthorized) {
      handleLogout();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // chặn hành động mặc định của form như refresh lại trang

    console.log(username, password);
    const response = await fetchLoginAPI(username, password);

    console.log(response);
    if (response?.status === 200) {
      await dispatch(setIsAuthorized(true));
      toast.success("Login successfully");
      localStorage.setItem("accessToken", response.data);
      navigate("/");

    }
  };


  const handleLoginSuccess = async (response) => {
    try {
      const res = await axios.post(`${API_ROOT}/auth/login-success`, {
        token: response.credential,
      });

      // Lưu JWT vào localStorage
      if (res?.data?.status === 200) {
        await dispatch(setIsAuthorized(true));
        toast.success("Login successfully");
        localStorage.setItem("accessToken", res.data.data);
        navigate("/");

      }
    } catch (error) {
      toast.error("Login failed");
    }
  };


  return (
    <div className="row">


      <div className="col-md-6 left-side-container text-start">

        <img src={logim_side} alt="login" className="img-fluid " />

      </div>

      <div className="col-md-6 justify-content-center align-items-center login-left text-center mx-auto">
        <div className="col-md-8 login-container mx-auto mt-10">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
          <h6 className=" text-start mt-5">WELCOME BACK</h6>
          <h3 className="fw-bold">Continue to your Account.</h3>
          <div className="d-flex justify-content-center mx-auto">
            <GoogleOAuthProvider clientId="675554674661-qaklq95eac0uhmjjh9bikdc2i1d6bcg6.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
              // Adjust the height as needed

              />
            </GoogleOAuthProvider>
          </div>
        </div>
        <div className="col-md-12 my-2 row justify-content-center align-items-center ">
          <div className="col-md-3">
            <hr />
          </div>
          <div className="col-md-3 d-flex justify-content-center align-items-center">
            <p className="text-center devider-text my-0">Or use username</p>
          </div>
          <div className="col-md-3">
            <hr />
          </div>
        </div>
        <form className="mx-5" onSubmit={handleLogin}>
          <div className="row gy-2 overflow-hidden">
            <div className="col-12">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username" className="form-label">
                  Username
                </label>
              </div>
            </div>
            <div className="col-12">
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <label htmlFor="password" className="form-label">
                  Password
                </label>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex gap-2 justify-content-between">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    name="rememberMe"
                    id="rememberMe"
                  />
                  <label
                    className="form-check-label text-secondary"
                    htmlFor="rememberMe"
                  >
                    Keep me logged in
                  </label>
                </div>
                <Link to="/forgot-password" className="link-primary text-decoration-none">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="d-grid my-3">
                <button className="btn-dark btn btn-lg" type="submit">
                  LOGIN
                </button>
              </div>
            </div>
            <div className="col-12">
              <p className="m-0 text-secondary text-center">
                Don't have an account?{" "}
                <Link
                  className="link-dark text-decoration-underline"
                  to="/register"
                >
                  {" "}
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
