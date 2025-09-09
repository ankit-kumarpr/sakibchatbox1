import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaSignOutAlt, FaShieldAlt, FaClock, FaIdCard, FaArrowLeft } from "react-icons/fa";
import "./profile.css";
import Base_url from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getYourProfile();
  }, []);

  const getYourProfile = async () => {
    try {
      setLoading(true);
      const url = `${Base_url}/auth/profile`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(url, { headers });
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/l");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never logged in";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'superadmin': return '#f44336';
      case 'admin': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header with Back Button */}
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
        <h1>My Profile</h1>
        <div style={{ width: '36px' }}></div> {/* Spacer for alignment */}
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">{profile?.name}</h2>
          <div 
            className="profile-role"
            style={{ backgroundColor: getRoleBadgeColor(profile?.role) }}
          >
            {profile?.role}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="profile-details">
        <div className="detail-item">
          <div className="detail-icon">
            <FaIdCard />
          </div>
          <div className="detail-content">
            <span className="detail-label">User ID</span>
            <span className="detail-value">{profile?.specialId || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaShieldAlt />
          </div>
          <div className="detail-content">
            <span className="detail-label">Account Type</span>
            <span className="detail-value" style={{ textTransform: 'capitalize' }}>
              {profile?.role}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaClock />
          </div>
          <div className="detail-content">
            <span className="detail-label">Last Login</span>
            <span className="detail-value">{formatDate(profile?.lastLogin)}</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Profile;