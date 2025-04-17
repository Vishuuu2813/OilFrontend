import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faUserCircle,
  faUser,
  faTachometerAlt,
  faSignInAlt,
  faCalendarAlt,
  faHistory,
  faCog,
  faSignOutAlt,
  faChevronRight,
  faBriefcase,
  faBuilding,
  faTimes,
  faHome,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarDay,
  faClock,
  faEdit,
  faIdCard,
  faGraduationCap,
  faBriefcaseMedical,
  faCheck,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    contact: "",
    address: "",
    createdAt: "",
    lastLogin: "",
    walletBalance: 0,
    totalShifts: 0,
    completedShifts: 0,
    upcomingShifts: 0,
    password: "", // Added password field here
    // Additional portfolio data
    education: "Bachelor of Science in Nursing",
    experience: "5 years",
    specialization: "Emergency Care",
    certifications: ["BLS Certified", "ACLS Certified", "PALS Certified"],
    availability: "Weekdays and alternate weekends",
    skills: ["Patient Care", "IV Administration", "Critical Care", "Wound Care"],
  });
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();

  // Check if user is logged in and get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (!token || !storedUserData) {
      navigate("/EmployeeLogin");
    } else {
      setUserData({
        ...storedUserData,
        password: storedUserData.password || "", // Make sure to include password from localStorage
        walletBalance: storedUserData.walletBalance || 4500,
        totalShifts: storedUserData.totalShifts || 12,
        completedShifts: storedUserData.completedShifts || 8,
        upcomingShifts: storedUserData.upcomingShifts || 3,
        // Additional portfolio data with defaults if not in stored data
        education: storedUserData.education || "Bachelor of Science in Nursing",
        experience: storedUserData.experience || "5 years",
        specialization: storedUserData.specialization || "Emergency Care",
        certifications: storedUserData.certifications || ["BLS Certified", "ACLS Certified", "PALS Certified"],
        availability: storedUserData.availability || "Weekdays and alternate weekends",
        skills: storedUserData.skills || ["Patient Care", "IV Administration", "Critical Care", "Wound Care"],
      });
    }
  }, [navigate]);

  // Update formData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prevState => ({
        ...prevState,
        fullname: userData.fullname || "",
        address: userData.address || ""
      }));
    }
  }, [userData]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/EmployeeLogin");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && event.target.id === "overlay") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Handle edit profile button click
  const handleEditProfileClick = () => {
    setShowEditModal(true);
    setErrorMessage("");
    setSuccessMessage("");
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate form
    if (!formData.fullname.trim()) {
      setErrorMessage("Name cannot be empty");
      return;
    }
    
    if (!formData.address.trim()) {
      setErrorMessage("Address cannot be empty");
      return;
    }
    
    // Check if user is trying to change password
    const isChangingPassword = formData.oldPassword.trim() !== "";
    
    if (isChangingPassword) {
      // Validate password fields
      if (!formData.newPassword.trim()) {
        setErrorMessage("New password cannot be empty");
        return;
      }
      
      if (formData.newPassword !== formData.confirmNewPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }
      
      // Get the stored password directly from localStorage for verification
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const storedPassword = storedUserData?.password || "";
      
      // Verify old password against the one in localStorage
      if (formData.oldPassword !== storedPassword) {
        setErrorMessage("Current password is incorrect");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Get user ID from localStorage
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const userId = storedUserData._id;
      
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      // Prepare data for API
      const updateData = {
        fullname: formData.fullname,
        email: userData.email,  // Keep the same email
        contact: userData.contact,  // Keep the same contact
        address: formData.address
      };
      
      // Add password if changing
      if (isChangingPassword) {
        updateData.password = formData.newPassword;
      } else {
        updateData.password = storedUserData.password;  // Use password directly from localStorage
      }
      
      // Call API to update user
      const response = await fetch(`https://oil-backend-maxf.vercel.appupdate-employee/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Update local storage with new data
        const updatedUserData = {
          ...storedUserData,
          fullname: formData.fullname,
          address: formData.address,
          password: isChangingPassword ? formData.newPassword : storedUserData.password
        };
        
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        
        // Update state
        setUserData(prevState => ({
          ...prevState,
          fullname: formData.fullname,
          address: formData.address,
          password: isChangingPassword ? formData.newPassword : storedUserData.password
        }));
        
        setSuccessMessage("Profile updated successfully");
        
        // Reset password fields
        setFormData(prevState => ({
          ...prevState,
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }));
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowEditModal(false);
          setSuccessMessage("");
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // The Edit Profile Modal
  const EditProfileModal = () => {
    if (!showEditModal) return null;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Edit Profile</h3>
            <button 
              style={styles.modalCloseButton} 
              onClick={() => setShowEditModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          {errorMessage && (
            <div style={styles.errorMessage}>
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div style={styles.successMessage}>
              <FontAwesomeIcon icon={faCheck} style={styles.successIcon} />
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.modalForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Full Name</label>
              <input 
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                style={styles.formInput}
                placeholder="Enter your full name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={styles.formTextarea}
                placeholder="Enter your address"
                rows={3}
              />
            </div>
            
            <div style={styles.passwordSection}>
              <h4 style={styles.passwordSectionTitle}>Change Password</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Current Password</label>
                <input 
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  placeholder="Enter current password"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>New Password</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  placeholder="Enter new password"
                  disabled={!formData.oldPassword}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Confirm New Password</label>
                <input 
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  placeholder="Confirm new password"
                  disabled={!formData.oldPassword}
                />
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="button" 
                style={styles.cancelButton}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={styles.saveButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Menu</h3>
          <button style={styles.closeSidebarButton} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={styles.userProfile}>
          <div style={styles.avatar}>
            <FontAwesomeIcon
              icon={faUserCircle}
              size="3x"
              style={styles.avatarIcon}
            />
          </div>
          <div style={styles.userInfo}>
            <h4 style={styles.userName}>{userData.fullname}</h4>
          </div>
        </div>

        <ul style={styles.sidebarLinks}>
          <li style={styles.sidebarItem}>
            <Link to="/" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faHome} style={styles.sidebarIcon} />{" "}
              Home
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Dashboard" style={styles.sidebarLink}>
              <FontAwesomeIcon
                icon={faTachometerAlt}
                style={styles.sidebarIcon}
              />{" "}
              Dashboard
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/DepartmentLogin" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faBuilding} style={styles.sidebarIcon} />{" "}
              Login as Department
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Booked-shifts" style={styles.sidebarLink}>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={styles.sidebarIcon}
              />{" "}
              My Shifts
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/worked-history" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faHistory} style={styles.sidebarIcon} />{" "}
              Booking History
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Portfolio" style={{...styles.sidebarLink, color: "#ffffff", backgroundColor: "#4a6cf7", borderLeft: "4px solid #ffffff"}}>
              <FontAwesomeIcon icon={faUserCircle} style={styles.sidebarIcon} />{" "}
              My Portfolio
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Wallet" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faWallet} style={styles.sidebarIcon} /> My
              Wallet
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Settings" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faCog} style={styles.sidebarIcon} />{" "}
              Settings
            </Link>
          </li>
          <li style={{ ...styles.sidebarItem, ...styles.logoutItem }}>
            <button onClick={handleLogout} style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faSignOutAlt} style={styles.sidebarIcon} />{" "}
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Toggle Button (visible on small screens) */}
      <button
        style={{
          ...styles.mobileMenuToggle,
          display: sidebarOpen ? "none" : "flex",
        }}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Overlay */}
      <div
        id="overlay"
        style={{
          ...styles.overlay,
          opacity: sidebarOpen ? "0.5" : "0",
          visibility: sidebarOpen ? "visible" : "hidden",
        }}
      />

      {/* Main Content Container */}
      <div
        style={{
          ...styles.contentContainer,
          marginLeft: sidebarOpen ? "280px" : "0",
        }}
      >
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>My Portfolio</h1>
          <div style={styles.headerRight}>
            <div style={styles.walletBalance}>
              <FontAwesomeIcon icon={faWallet} style={styles.walletIcon} /> ₹
              {userData.walletBalance}
            </div>
            <button style={styles.profileButton} onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faUserCircle} style={styles.buttonIcon} />{" "}
              Profile
            </button>
          </div>
        </header>

        {/* Add the edit profile modal */}
        <EditProfileModal />

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Profile Header with Avatar */}
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatarContainer}>
              <FontAwesomeIcon
                icon={faUserCircle}
                style={styles.profileAvatar}
              />
            </div>
            <div style={styles.profileHeaderInfo}>
              <h2 style={styles.profileName}>{userData.fullname}</h2>
              <p style={styles.profileTitle}>{userData.specialization} Specialist</p>
              <div style={styles.profileStats}>
                <div style={styles.profileStat}>
                  <FontAwesomeIcon icon={faBriefcase} style={styles.profileStatIcon} />
                  <span>{userData.experience}</span>
                </div>
                <div style={styles.profileStat}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={styles.profileStatIcon} />
                  <span>{userData.completedShifts} Shifts</span>
                </div>
              </div>
              <button style={styles.editButton} onClick={handleEditProfileClick}>
                <FontAwesomeIcon icon={faEdit} style={styles.editButtonIcon} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faUser} style={styles.sectionIcon} />{" "}
                Personal Information
              </h3>
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Email</p>
                  <p style={styles.infoValue}>{userData.email}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <FontAwesomeIcon icon={faPhone} style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Phone</p>
                  <p style={styles.infoValue}>{userData.contact}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Address</p>
                  <p style={styles.infoValue}>{userData.address}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <FontAwesomeIcon icon={faCalendarDay} style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Joined On</p>
                  <p style={styles.infoValue}>
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Work History Summary */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faHistory} style={styles.sectionIcon} />{" "}
                Work History Summary
              </h3>
              <Link to="/worked-history" style={styles.viewAllLink}>
                View full history <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIconWrapper}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={styles.statIcon} />
                </div>
                <div style={styles.statContent}>
                  <h3 style={styles.statValue}>{userData.totalShifts}</h3>
                  <p style={styles.statLabel}>Total Shifts</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIconWrapper}>
                  <FontAwesomeIcon icon={faHistory} style={styles.statIcon} />
                </div>
                <div style={styles.statContent}>
                  <h3 style={styles.statValue}>{userData.completedShifts}</h3>
                  <p style={styles.statLabel}>Completed Shifts</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIconWrapper}>
                  <FontAwesomeIcon icon={faBriefcase} style={styles.statIcon} />
                </div>
                <div style={styles.statContent}>
                  <h3 style={styles.statValue}>{userData.upcomingShifts}</h3>
                  <p style={styles.statLabel}>Upcoming Shifts</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Internal CSS styles object - styles declaration would go here

const styles = {
    // Main container
    mainContainer: {
      display: "flex",
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh",
      position: "relative",
      backgroundColor: "#f5f7fa",
    },
  
    // Content container
    contentContainer: {
      flex: 1,
      transition: "margin-left 0.3s ease",
      width: "100%",
    },
  
    // Sidebar styles
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "280px",
      height: "100vh",
      backgroundColor: "#111827",
      color: "#fff",
      zIndex: 1000,
      transition: "transform 0.3s ease",
      overflowY: "auto",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  
    sidebarHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #2d3748",
    },
  
    sidebarTitle: {
      margin: 0,
      fontSize: "20px",
      fontWeight: 600,
      color: "#ffffff",
    },
  
    closeSidebarButton: {
      background: "none",
      border: "none",
      color: "#a0aec0",
      fontSize: "16px",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
  
    userProfile: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #2d3748",
    },
  
    avatar: {
      marginRight: "15px",
      color: "#4a6cf7",
    },
  
    avatarIcon: {
      color: "#4a6cf7",
    },
  
    userInfo: {
      flex: 1,
    },
  
    userName: {
      margin: 0,
      fontSize: "16px",
      fontWeight: 600,
      color: "#ffffff",
    },
  
    sidebarLinks: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
  
    sidebarItem: {
      margin: 0,
      padding: 0,
    },
  
    sidebarLink: {
      display: "flex",
      alignItems: "center",
      padding: "15px 20px",
      color: "#cbd5e0",
      textDecoration: "none",
      transition: "all 0.2s ease",
      fontSize: "14px",
      borderLeft: "4px solid transparent",
      width: "100%",
      background: "none",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
    },
  
    sidebarIcon: {
      width: "20px",
      marginRight: "15px",
      fontSize: "16px",
    },
  
    logoutItem: {
      marginTop: "20px",
      borderTop: "1px solid #2d3748",
      paddingTop: "10px",
    },
  
    // Mobile menu toggle
    mobileMenuToggle: {
      position: "fixed",
      top: "15px",
      left: "15px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#4a6cf7",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      zIndex: 999,
      cursor: "pointer",
      fontSize: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
  
    // Overlay
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      zIndex: 999,
      transition: "opacity 0.3s ease, visibility 0.3s ease",
    },
  
    // Header
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 30px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
  
    headerTitle: {
      margin: 0,
      fontSize: "24px",
      fontWeight: 600,
      color: "#1f2937",
      marginLeft: "2vw",
    },
  
    headerRight: {
      display: "flex",
      alignItems: "center",
    },
  
    walletBalance: {
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
      marginRight: "20px",
    },
  
    walletIcon: {
      marginRight: "8px",
      color: "#4a6cf7",
    },
  
    profileButton: {
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#4a6cf7",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  
    buttonIcon: {
      marginRight: "8px",
    },
  
    // Main content
    mainContent: {
      padding: "20px 30px",
    },
  
    // Profile Header
    profileHeader: {
      display: "flex",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      marginBottom: "30px",
      alignItems: "center",
      flexWrap: "wrap",
    },
  
    profileAvatarContainer: {
      marginRight: "30px",
    },
  
    profileAvatar: {
      fontSize: "100px",
      color: "#4a6cf7",
    },
  
    profileHeaderInfo: {
      flex: 1,
    },
  
    profileName: {
      margin: 0,
      fontSize: "28px",
      fontWeight: 700,
      color: "#1f2937",
    },
  
    profileTitle: {
      fontSize: "18px",
      color: "#4a6cf7",
      margin: "5px 0 15px 0",
    },
  
    profileStats: {
      display: "flex",
      marginBottom: "20px",
    },
  
    profileStat: {
      display: "flex",
      alignItems: "center",
      marginRight: "20px",
      color: "#6b7280",
      fontSize: "14px",
    },
  
    profileStatIcon: {
      marginRight: "8px",
      color: "#4a6cf7",
    },
  
    editButton: {
      display: "flex",
      alignItems: "center",
      padding: "8px 16px",
      backgroundColor: "#f3f4f6",
      border: "none",
      borderRadius: "8px",
      color: "#4b5563",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  
    editButtonIcon: {
      marginRight: "8px",
    },
  
    // Section styles
    section: {
      marginBottom: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
  
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "10px",
    },
  
  sectionTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
      color: "#1f2937",
      display: "flex",
      alignItems: "center",
    },
  
    sectionIcon: {
      marginRight: "10px",
      color: "#4a6cf7",
    },
  
    viewAllLink: {
      fontSize: "14px",
      color: "#4a6cf7",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
  
    // Info grid
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    },
  
    infoItem: {
      display: "flex",
      alignItems: "flex-start",
    },
  
    infoIcon: {
      width: "20px",
      height: "20px",
      marginRight: "15px",
      marginTop: "2px",
      color: "#4a6cf7",
    },
  
    infoContent: {
      flex: 1,
    },
  
    infoLabel: {
      margin: "0 0 5px 0",
      fontSize: "14px",
      color: "#6b7280",
    },
  
    infoValue: {
      margin: 0,
      fontSize: "16px",
      color: "#1f2937",
      fontWeight: 500,
    },
  
    // Stats grid
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
    },
  
    statCard: {
      display: "flex",
      alignItems: "center",
      padding: "15px",
      borderRadius: "10px",
      backgroundColor: "#f9fafb",
    },
  
    statIconWrapper: {
      width: "50px",
      height: "50px",
      borderRadius: "10px",
      backgroundColor: "rgba(74, 108, 247, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "15px",
    },
  
    statIcon: {
      fontSize: "20px",
      color: "#4a6cf7",
    },
  
    statContent: {
      flex: 1,
    },
  
    statValue: {
      margin: 0,
      fontSize: "22px",
      fontWeight: 700,
      color: "#1f2937",
    },
  
    statLabel: {
      margin: 0,
      fontSize: "14px",
      color: "#6b7280",
    },
  
    // Modal styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1100,
    },
  
    modalContent: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      overflow: "hidden",
    },
  
    modalHeader: {
      padding: "20px",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    modalTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
      color: "#1f2937",
    },
  
    modalCloseButton: {
      background: "none",
      border: "none",
      color: "#6b7280",
      fontSize: "16px",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
  
    modalForm: {
      padding: "20px",
    },
  
    formGroup: {
      marginBottom: "20px",
    },
  
    formLabel: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: 500,
      color: "#4b5563",
    },
  
    formInput: {
      width: "100%",
      padding: "10px 15px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      color: "#1f2937",
      transition: "border-color 0.3s ease",
    },
  
    formTextarea: {
      width: "100%",
      padding: "10px 15px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      color: "#1f2937",
      transition: "border-color 0.3s ease",
      resize: "vertical",
      minHeight: "100px",
    },
  
    passwordSection: {
      marginTop: "30px",
      marginBottom: "20px",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "20px",
    },
  
    passwordSectionTitle: {
      margin: "0 0 20px 0",
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
    },
  
    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "15px",
      marginTop: "30px",
    },
  
    cancelButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "#f9fafb",
      color: "#4b5563",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  
    saveButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#4a6cf7",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  
    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      padding: "12px 15px",
      borderRadius: "8px",
      margin: "15px 20px 0 20px",
      fontSize: "14px",
    },
  
    successMessage: {
      backgroundColor: "#ecfdf5",
      color: "#047857",
      padding: "12px 15px",
      borderRadius: "8px",
      margin: "15px 20px 0 20px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
    },
  
    successIcon: {
      marginRight: "8px",
    },
  };
  
  

export default Portfolio;