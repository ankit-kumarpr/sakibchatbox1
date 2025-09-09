import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import { FaComments, FaDoorOpen, FaUser } from 'react-icons/fa';
import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";
import UserIcon from '../images/user.png';
import messageIcon from '../images/message.png';
import RoomIcon from '../images/room.png'; 
import adminIcon from '../images/check-out.png'; 
import "./main.css";
import PageTitle from "./PageTitle.jsx";
import Protected from "../Pages/Protected.jsx";
import SuperAdminDashboard from "../Pages/Admin/SuperAdminDashboard.jsx";
import AdminDashboard from "../Pages/Subadmin/AdminDashboard.jsx";
import UserDashboard from "../Pages/User/UserDashboard.jsx";
import Profile from "../Pages/Admin/Profile.jsx";
import RegisterAdmin from "../Pages/Admin/RegisterAdmin.jsx";
import ViewGroups from "../Pages/Admin/ViewGroups.jsx";
import ViewUsers from "../Pages/Admin/ViewUsers.jsx";
import UserRegister from "../Pages/Subadmin/UserRegister.jsx";
import Groups from "../Pages/Subadmin/Groups.jsx";
import MyGroups from "../Pages/User/MyGroups.jsx";
import GroupChat from "../Pages/User/GroupChat.jsx";

const Allmain = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const [loginuserRole, setUserRole] = useState("User");
const navigate=useNavigate();
const hadnlelogout=()=>{
    sessionStorage.clear();
        navigate('/');
}

  useEffect(() => {
    const role = sessionStorage.getItem("userRole") || 'User'; 
    setUserRole(role);
   
    const routeToTitle = {
      "/Super Admin Dashboard": "Dashboard",
      "/Admin Dashboard": "Franchise dashboard",
      "/User Dashboard":"User Dashboard",
      "/Register Admin":"/register-admin"
    };

    const title = routeToTitle[location.pathname];
    if (title) {
      setPageTitle(title);
    } else {
      setPageTitle("");
    }
  }, [location.pathname]);

  const renderFooter = () => {
    switch(loginuserRole) {
      case 'superadmin':
        return (
          <footer className="app-footer">
            <div className="footer-container">
              
              <div onClick={hadnlelogout} className="footer-btn" style={{ cursor: 'pointer' }}>
      <img src={adminIcon} alt="Admin" className="footer-icon" />
      <div className="footer-label">Logout</div>
    </div>
              <Link to="/profile" className="footer-btn">
                <img src={UserIcon} alt="User" className="footer-icon" />
                <div className="footer-label">Me</div>
              </Link>
            </div>
          </footer>
        );
      
      case 'admin':
        return (
          <footer className="app-footer">
            <div className="footer-container">
              <div onClick={hadnlelogout} className="footer-btn" style={{ cursor: 'pointer' }}>
      <img src={adminIcon} alt="Admin" className="footer-icon" />
      <div className="footer-label">Logout</div>
    </div>
             
              <Link to="/profile" className="footer-btn">
                <img src={UserIcon} alt="Me" className="footer-icon" />
                <div className="footer-label">Me</div>
              </Link>
            </div>
          </footer>
        );
      
      case 'user':
      default:
        return (
          <footer className="app-footer">
            <div className="footer-container">
             <div onClick={hadnlelogout} className="footer-btn" style={{ cursor: 'pointer' }}>
      <img src={adminIcon} alt="Admin" className="footer-icon" />
      <div className="footer-label">Logout</div>
    </div>
              <Link to="/profile" className="footer-btn">
                <img src={UserIcon} alt="Me" className="footer-icon" />
                <div className="footer-label">Me</div>
              </Link>
            </div>
          </footer>
        );
    }
  };

  return (
    <div className="app-container">
      {/* <Header />
      <SideBar /> */}
      
      <main className="app-content">
        <Routes>
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/view-groups" element={<ViewGroups />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/add-users" element={<UserRegister />} />
          <Route path="/create-group" element={<Groups />} />
          <Route path="/my-group" element={<MyGroups />} />
          <Route path="/group-chat/:groupId" element={<GroupChat />} />
        </Routes>
      </main>
      
      {renderFooter()}
    </div>
  );
};

export default Allmain;