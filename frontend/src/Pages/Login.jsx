import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "../images/gnet-logo.webp";
import robot from "../images/robot-icon.png"; 
import Base_url from "./config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaFacebook, FaInstagram, FaYoutube, FaGlobe, FaCode, FaMobileAlt, FaChartLine, FaPenFancy, FaHashtag,  FaFlag } from 'react-icons/fa';
import { 
  FiFlag // Generic flag icon
} from 'react-icons/fi';
import { 
  GiIndiaGate,
  // GiGermanShepherd,
  GiAustralia,
  // GiUnitedArabEmirates,
  GiPalmTree, // For Singapore
  GiWoodenCrate, // For Canada
  GiBigDiamondRing, // For UAE
  GiJapan // For Japan
} from 'react-icons/gi';
// import { 
//   GiIndiaGate,
//   GiGermanShepherd,
//   GiAustralia,
//   GiUnitedArabEmirates,
//    GiSingapore,
//   GiCanada,
//   GiUk,
//   GiJapan
// } from 'react-icons/gi';

const Login = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef([]);
  const navigate = useNavigate();

const socialLinks = [
    { icon: <FaGoogle />, url: "https://share.google/HyP263Tcx3BeSAq5V", color: "#DB4437" },
    { icon: <FaFacebook />, url: "https://www.facebook.com/grandeurnetindia/", color: "#4267B2" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/grandeur_net/", color: "#E1306C" },
    { icon: <FaYoutube />, url: "https://youtube.com/@grandeurnet?si=hWZascTXwYS8RDF8", color: "#FF0000" },
    { icon: <FaGlobe />, url: "https://grandeurnet.com/", color: "#4CAF50" }
  ];

  const services = [
    { icon: <FaCode />, name: "Web Development", color: "#3498db" },
    { icon: <FaMobileAlt />, name: "App Development", color: "#9b59b6" },
    { icon: <FaChartLine />, name: "Digital Marketing", color: "#e74c3c" },
    { icon: <FaPenFancy />, name: "Graphic Designing", color: "#f39c12" },
    // { icon: <FaHashtag />, name: "Social Media Marketing", color: "#1abc9c" }
  ];

   const locations = [
    { icon: <GiIndiaGate />, name: "India", color: "#FF9933" },
    { icon: <GiPalmTree />, name: "Singapore", color: "#ED2939" },
    // { icon: <GiGermanShepherd />, name: "Germany", color: "#000000" },
    { icon: <GiAustralia />, name: "Australia", color: "#00008B" },
    { icon: <FaFlag />, name: "USA", color: "#3C3B6E" },
    // { icon: <GiBigDiamondRing />, name: "UAE", color: "#008000" },
    { icon: <GiWoodenCrate />, name: "Canada", color: "#FF0000" },
    { icon: <GiJapan />, name: "Japan", color: "#BC002D" }
  ];

  const handleOtpChange = (e, index) => {
    if (isNaN(e.target.value)) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (isNaN(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
  };

  const handleLogin = async (enteredOtp) => {
    setIsLoading(true);
    try {
      const url = `${Base_url}/auth/login`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = {
        specialId: enteredOtp
      };

      const response = await axios.post(url, requestBody, { headers });

      if (response.data.message === "Login successful") {
       toast.success("Logged in successfully!");

        const token = response.data.token;
        const role = response.data.user?.role;
        const id = response.data.user?.id;

        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("userId", id);

        switch (role) {
          case "superadmin":
            navigate("/super-admin-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "user":
            navigate("/user-dashboard");
            break;
          default:
            Swal.fire("Error", "Unknown user role", "error");
        }
      } else {
        Swal.fire("Error", response.data.message || "Login failed", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Swal.fire("Error", "Please enter the complete 6-digit code", "error");
      return;
    }

    await handleLogin(enteredOtp);
  };

  
  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="login-container">
      <div className="header-section">
        <img src={logo} alt="Company Logo" className="logo" />
        <img src={robot} alt="Flying Robot" className="robot" />
      </div>

      <div className="welcome-section">
        <h2 className="welcome-title">Welcome to Infun India</h2>
        <h3 className="welcome-subtitle">Chat System</h3>
      </div>

      <div className="otp-content">
        <p className="otp-subtitle">Enter your 6-digit security code</p>
        <form onSubmit={handleVerifyOTP}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(ref) => (otpInputRefs.current[index] = ref)}
                className="otp-digit"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            className="verify-btn"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Verify & Login"
            )}
          </button>
        </form>


        {/* social media */}
         <div className="social-section">
          <p className="social-text">Connect with us</p>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <div 
                key={index}
                className="social-icon"
                style={{ '--icon-color': social.color }}
                onClick={() => handleSocialClick(social.url)}
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>

{/* service section */}
   {/* <div className="services-section">
          <p className="services-title">Our Services</p>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index} style={{ '--service-color': service.color }}>
                <div className="service-icon">
                  {service.icon}
                </div>
                <p className="service-name">{service.name}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* location */}

     <div className="locations-section">
          <p className="locations-title">Our Global Presence</p>
          <div className="locations-grid">
            {locations.map((location, index) => (
              <div className="location-card" key={index} style={{ '--location-color': location.color }}>
                <div className="location-icon">
                  {location.icon}
                </div>
                <p className="location-name">{location.name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;