import React, { useState } from "react";
import register from "../../assets/img/login_side.png";
import { createUserAPI, forgotPasswordSendEmailAPI, forgotPasswordVerifyOtpAPI } from "../../apis";
import { toast } from "react-toastify";
import { InputOTP } from "antd-input-otp";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "antd";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(2);
  const [repassword, setRepassword] = useState(""); // New state for repassword
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  // #region The Uncontrolled Logic
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    if (step === 1) {
      e.preventDefault();
      setIsLoading(true)
      try {
        const response = await forgotPasswordSendEmailAPI(email);
        if (response.status === 200) {
          setStep(2);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
    }
  };
  const handleVerifyOtp = async (values) => {
    const { otp } = values;
    if (!otp || otp.includes(undefined) || otp.includes(""))
      return form.setFields([
        {
          name: "otp",
          errors: ["OTP is invalid."]
        }
      ]);

    console.log(typeof otp);
  }

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

          {step === 1 &&
            <form action="#!" className="mx-5" onSubmit={handleSendEmail}>
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
              <div className="col-12">
                <div className="d-grid my-3">
                  <button className="btn-dark btn btn-lg" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "SEND"}
                  </button>
                </div>
              </div>
            </form>
          }
          {
            step === 2 &&
            <Form form={form} onFinish={handleVerifyOtp}>
          <Form.Item
            name="otp"
            className="center-error-message"
            rules={[{ validator: async () => Promise.resolve() }]}
          >
            <InputOTP autoFocus inputType="numeric" length={6} />
          </Form.Item>

          <Form.Item noStyle>
          <button className="btn-dark btn btn-lg" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "SEND"}
                  </button>
              </Form.Item>
            </Form>
          }



          <div className="row gy-2 overflow-hidden mx-5 ">

            <div className="col-12 my-3">
              <p className="m-0 text-secondary text-center">
                Already have an account?{" "}
                <Link to="/login" className="link-dark text-decoration-underline">
                  Login
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
