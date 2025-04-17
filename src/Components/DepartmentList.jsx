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
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Department from "./Department"; // Import the Department component

// Sample data for booked shifts

function DepartmentList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // User data (would typically come from context or redux in a real app)
  const userData = {
    walletBalance: 4500,
    totalShifts: 12,
    completedShifts: 8,
    upcomingShifts: 3,
    userName: "John Doe",
    staffId: "#12345",
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token") !== null;

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/EmployeeLogin");
    }
  }, [isLoggedIn, navigate]);

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
            <h4 style={styles.userName}>{userData.userName}</h4>
            <p style={styles.staffId}>Staff ID: {userData.staffId}</p>
          </div>
        </div>

        <ul style={styles.sidebarLinks}>
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
            <Link to="/EmployeeLogin" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faSignInAlt} style={styles.sidebarIcon} />{" "}
              Login as Employee
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
            <Link to="/Portfolio" style={styles.sidebarLink}>
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
            <Link to="/Logout" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faSignOutAlt} style={styles.sidebarIcon} />{" "}
              Logout
            </Link>
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
          <h1 style={styles.headerTitle}>Employee Dashboard</h1>
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

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Personal Portfolio Section */}
          {/* Quick Navigation Buttons */}
          <div style={styles.quickButtonsContainer}>
            <Link to="/Booked-shifts" style={styles.quickButton}>
              My Shifts
            </Link>
            <Link to="/worked-history" style={styles.quickButton}>
              Worked History
            </Link>
            <Link to="/Portfolio" style={styles.quickButton}>
              Portfolio
            </Link>
            <Link to="/Wallet" style={styles.quickButton}>
              Wallet
            </Link>
            <Link to="/Settings" style={styles.quickButton}>
              Settings
            </Link>
          </div>

          {/* Department Section - Using the Department Component */}
          <Department />
        </main>
      </div>
    </div>
  );
}

// Internal CSS styles object
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

  staffId: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    color: "#a0aec0",
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
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 500,
    color: "#4a6cf7",
    textDecoration: "none",
  },
  quickButtonsContainer: {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '25px',
},

quickButton: {
  padding: '10px 20px',
  backgroundColor: '#4a6cf7',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'background-color 0.3s ease',
},

};
export default DepartmentList;
