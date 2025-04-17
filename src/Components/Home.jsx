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
  faBell,
  faHeart, // Added heart icon for wishlist
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Department from "./Department";
import TrainingBox from "./TrainingBox";
import axios from "axios";

function Home() {
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
  });
  
  const navigate = useNavigate();

  // Function to fetch current wallet balance
  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      
      if (!token || !storedUserData || !storedUserData._id) {
        return;
      }
      
      // Make API call to get the current wallet balance
      const response = await axios.get(`http://localhost:8000/get-wallet-balance/${storedUserData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.status === "success") {
        // Update local state with new balance
        setUserData(prevData => ({
          ...prevData,
          walletBalance: response.data.walletBalance
        }));
        
        // Also update localStorage to keep it in sync
        const updatedUserData = {...storedUserData, walletBalance: response.data.walletBalance};
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Check if user is logged in and get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (!token || !storedUserData) {
      navigate("/EmployeeLogin");
    } else {
      setUserData({
        ...storedUserData,
        walletBalance: storedUserData.walletBalance || 0,
        totalShifts: storedUserData.totalShifts || 12,
        upcomingShifts: storedUserData.upcomingShifts || 3,
      });
      
      // Fetch the latest wallet balance when component mounts
      fetchWalletBalance();
      
      // Set up a periodic refresh of wallet balance (every 30 seconds)
      const balanceRefreshInterval = setInterval(fetchWalletBalance, 30000);
      
      // Clean up interval on component unmount
      return () => {
        clearInterval(balanceRefreshInterval);
      };
    }
  }, [navigate]);

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

  // Navigate to notifications page
  const goToNotifications = () => {
    navigate("/Notification");
  };
  
  // Navigate to wishlist page
  const goToWishlist = () => {
    navigate("/Wishlist");
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
    <>
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
            <Link to="/Wishlist" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faHeart} style={styles.sidebarIcon} /> My
              Wishlist
            </Link>
          </li>
          <li style={styles.sidebarItem}>
            <Link to="/Notification" style={styles.sidebarLink}>
              <FontAwesomeIcon icon={faBell} style={styles.sidebarIcon} /> Notifications
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
          <h1 style={styles.headerTitle}>Welcome, {userData.fullname}</h1>
          <div style={styles.headerRight}>
            <div style={styles.walletBalance}>
              <FontAwesomeIcon icon={faWallet} style={styles.walletIcon} /> ₹
              {userData.walletBalance}
            </div>
            {/* Wishlist icon */}
            <button style={styles.notificationButton} onClick={goToWishlist}>
              <FontAwesomeIcon icon={faHeart} style={styles.notificationIcon} />
            </button>
            {/* Notification icon */}
            <button style={styles.notificationButton} onClick={goToNotifications}>
              <FontAwesomeIcon icon={faBell} style={styles.notificationIcon} />
            </button>
            <button style={styles.profileButton} onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faUserCircle} style={styles.buttonIcon} />{" "}
              Profile
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.mainContent}>
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
            <Link to="/Wishlist" style={styles.quickButton}>
              Wishlist
            </Link>
            <Link to="/Settings" style={styles.quickButton}>
              Settings
            </Link>
            <Link to="/Traningbox" style={styles.quickButton}>
              TrainingBox
            </Link>
            <Link to="/ExpiredShifts" style={styles.quickButton}>
              Expired Shifts
            </Link>
          </div>

          {/* Upcoming Shifts Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={styles.sectionIcon}
                />{" "}
                Upcoming Shifts
              </h2>
              <Link to="/Booked-shifts" style={styles.viewAllLink}>
                View all <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </div>
            {userData.upcomingShifts > 0 ? (
              <div style={styles.upcomingShiftsMessage}>
                You have {userData.upcomingShifts} upcoming shifts. View details in My Shifts.
              </div>
            ) : (
              <div style={styles.noShiftsMessage}>
                You don't have any upcoming shifts scheduled.
              </div>
            )}

            {/* Department Section - Using the Department Component */}
            <Department />
          </div>
        </main>
      </div>
    </div>
    </>
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

  // Notification button styles
  notificationButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#4a6cf7",
    border: "none",
    cursor: "pointer",
    marginRight: "15px",
    transition: "background-color 0.3s ease",
  },

  notificationIcon: {
    color: "#ffffff",
    fontSize: "16px",
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

  // User stats grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },

  statIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    backgroundColor: "#4a6cf7",
    marginRight: "15px",
  },

  statIcon: {
    fontSize: "24px",
    color: "#ffffff",
  },

  statContent: {
    flex: 1,
  },

  statValue: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "#1f2937",
  },

  statLabel: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
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

  // Profile grid
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "15px",
  },

  profileItem: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },

  profileLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "5px",
  },

  profileValue: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#1f2937",
  },

  // Upcoming shifts
  upcomingShiftsMessage: {
    padding: "15px",
    fontSize: "16px",
    color: "#1f2937",
    backgroundColor: "#e1f5fe",
    borderRadius: "8px",
  },

  noShiftsMessage: {
    padding: "15px",
    fontSize: "16px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    textAlign: "center",
  },

  // Quick buttons
  quickButtonsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },

  quickButton: {
    padding: "10px 20px",
    backgroundColor: "#4a6cf7",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  },
};

export default Home;