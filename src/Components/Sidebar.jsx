import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChartLine,
  faGlobe,
  faUsers,
  faBuilding,
  faWallet,
  faCog,
  faSignOutAlt,
  faQuestionCircle,
  faChevronDown,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Sidebar Component that can be imported into any page
const Sidebar = ({ isCollapsed = false, toggleSidebar, activePage = 'dashboard' }) => {
  // State for dropdown menus
  const [dashboardOpen, setDashboardOpen] = useState(activePage === 'dashboard');
  const [userOpen, setUserOpen] = useState(activePage === 'users');
  const [deptOpen, setDeptOpen] = useState(activePage === 'departments');
  const [financeOpen, setFinanceOpen] = useState(activePage === 'finance');
  const [settingsOpen, setSettingsOpen] = useState(activePage === 'settings');

  // Toggle dropdown menus
  const toggleDropdown = (setter) => {
    setter((prevState) => !prevState);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {!isCollapsed && (
        <>
          <div className="profile-section">
            <div className="profile-pic">A</div>
            <div className="profile-info">
              <div className="profile-name">Admin User</div>
              <div className="profile-role">
                <span className="profile-status"></span>Online
              </div>
            </div>
          </div>

          <div className="sidebar-header">
            <div className="logo">A</div>
            <h2>Admin Panel</h2>
          </div>
        </>
      )}

      <div className="toggle-sidebar" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <div className="nav-item">
        <button
          className={`dropdown ${dashboardOpen ? 'active' : ''}`}
          onClick={() => toggleDropdown(setDashboardOpen)}
        >
          <FontAwesomeIcon icon={faHome} />
          {!isCollapsed && <span>Dashboard</span>}
          {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />}
        </button>
        {!isCollapsed && (
          <div className={`dropdown-content ${dashboardOpen ? 'show' : ''}`}>
            <a href="#">
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faGlobe} /> Overview
            </a>
          </div>
        )}
      </div>

      <div className="nav-item">
        <button
          className={`dropdown ${userOpen ? 'active' : ''}`}
          onClick={() => toggleDropdown(setUserOpen)}
        >
          <FontAwesomeIcon icon={faUsers} />
          {!isCollapsed && <span>Users</span>}
          {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />}
        </button>
        {!isCollapsed && (
          <div className={`dropdown-content ${userOpen ? 'show' : ''}`}>
            <Link to={"UserDetails"}>User Details</Link>
            <Link to={"CreateUser"}>Create User</Link>

            <a href="Admin Tags/User-Block.html">User Block</a>
          </div>
        )}
      </div>

      <div className="nav-item">
        <button
          className={`dropdown ${deptOpen ? 'active' : ''}`}
          onClick={() => toggleDropdown(setDeptOpen)}
        >
          <FontAwesomeIcon icon={faBuilding} />
          {!isCollapsed && <span>Departments</span>}
          {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />}
        </button>
        {!isCollapsed && (
          <div className={`dropdown-content ${deptOpen ? 'show' : ''}`}>
          <Link to="/AdminDashboard/DepartmentCategory">Create Category</Link>
          <Link to="/AdminDashboard/CreateDepartment">Create Department</Link>


            <a href="Admin Tags/Department-card.html">Department Card Maker</a>
            <a href="Admin Tags/Complain-department.html">Complain Department</a>
            <a href="Admin Tags/Department-details.html">Department Details</a>

            <a href="Admin Tags/Department-Block.html">Block Department</a>
          </div>
        )}
      </div>

      <div className="nav-item">
        <button
          className={`dropdown ${financeOpen ? 'active' : ''}`}
          onClick={() => toggleDropdown(setFinanceOpen)}
        >
          <FontAwesomeIcon icon={faWallet} />
          {!isCollapsed && <span>Finance</span>}
          {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />}
        </button>
        {!isCollapsed && (
          <div className={`dropdown-content ${financeOpen ? 'show' : ''}`}>
            <a href="Admin Tags/Payment-Details.html">Payment Manager</a>
            <a href="Admin Tags/Recharge-manager.html">Recharge Manager</a>
            <a href="#">Expense Tracking</a>
            <a href="#">Generate Invoices</a>
          </div>
        )}
      </div>

      <div className="nav-item">
        <button
          className={`dropdown ${settingsOpen ? 'active' : ''}`}
          onClick={() => toggleDropdown(setSettingsOpen)}
        >
          <FontAwesomeIcon icon={faCog} />
          {!isCollapsed && <span>Settings</span>}
          {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />}
        </button>
        {!isCollapsed && (
          <div className={`dropdown-content ${settingsOpen ? 'show' : ''}`}>
            <a href="#">Account Settings</a>
            <a href="#">Security Settings</a>
            <a href="#">Dashboard Settings</a>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <a href="#">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faQuestionCircle} /> <span>Help</span>
          </a>
        </div>
      )}

      {/* Include CSS directly in the component */}
      <style jsx>
        {`
          /* Sidebar Styles */
          .sidebar {
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 280px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            transition: width 0.3s ease;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px solid #e2e8f0;
          }
          
          .sidebar.collapsed {
            width: 80px;
          }
          
          .profile-section {
            display: flex;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .profile-pic {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4361ee;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            margin-right: 12px;
          }
          
          .profile-info {
            flex: 1;
          }
          
          .profile-name {
            font-weight: 600;
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 4px;
          }
          
          .profile-role {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #718096;
          }
          
          .profile-status {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            margin-right: 6px;
            display: inline-block;
          }
          
          .sidebar-header {
            display: flex;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .logo {
            width: 40px;
            height: 40px;
            background-color: #4361ee;
            color: #ffffff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            margin-right: 12px;
          }
          
          .sidebar-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
          }
          
          .toggle-sidebar {
            padding: 12px;
            background-color: transparent;
            border: none;
            color: #4361ee;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px auto;
          }
          
          .nav-item {
            margin: 5px 0;
          }
          
          .dropdown {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 12px 20px;
            border: none;
            background-color: transparent;
            color: #718096;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
          }
          
          .dropdown.active {
            background-color: #eef2ff;
            color: #4361ee;
            border-left: 4px solid #4361ee;
          }
          
          .dropdown svg:first-child {
            margin-right: 12px;
            width: 20px;
            text-align: center;
          }
          
          .dropdown .dropdown-arrow {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.2s ease;
          }
          
          .dropdown.active .dropdown-arrow {
            transform: translateY(-50%) rotate(180deg);
          }
          
          .dropdown-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background-color: #f8fafc;
            padding-left: 20px;
          }
          
          .dropdown-content.show {
            max-height: 300px;
          }
          
          .dropdown-content a {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            color: #718096;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s ease;
          }
          
          .dropdown-content a:hover {
            color: #4361ee;
          }
          
          .sidebar-footer {
            border-top: 1px solid #e2e8f0;
            padding: 15px 20px;
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
          }
          
          .sidebar-footer a {
            display: flex;
            align-items: center;
            color: #718096;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s ease;
          }
          
          .sidebar-footer a:hover {
            color: #4361ee;
          }
          
          .sidebar-footer a svg {
            margin-right: 8px;
          }
          
          /* Responsive styles */
          @media (max-width: 768px) {
            .sidebar {
              width: 80px;
            }
            
            .sidebar:not(.collapsed) {
              width: 280px;
              transform: translateX(0);
            }
            
            .sidebar.collapsed {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;