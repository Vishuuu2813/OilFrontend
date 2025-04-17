import React from "react";
import "./CSS/AdminDashboard.css";

const AdminDashboard = () => {
  const applyFilters = () => {
    alert("Filters applied! (Functionality pending)");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="filter-section">
        <h2>Filter Departments</h2>
        <div className="filters">
          <details>
            <summary>Shift Type</summary>
            <label><input type="checkbox" className="filter" value="morning" /> Morning</label>
            <label><input type="checkbox" className="filter" value="afternoon" /> Afternoon</label>
            <label><input type="checkbox" className="filter" value="night" /> Night</label>
          </details>

          <details>
            <summary>Location</summary>
            <label><input type="checkbox" className="filter" value="factory" /> Within the factory</label>
            <label><input type="checkbox" className="filter" value="external" /> External departments</label>
          </details>

          <details>
            <summary>Department Size</summary>
            <label><input type="checkbox" className="filter" value="small" /> Small</label>
            <label><input type="checkbox" className="filter" value="medium" /> Medium</label>
            <label><input type="checkbox" className="filter" value="large" /> Large</label>
          </details>

          <details>
            <summary>Shift Duration</summary>
            <label><input type="checkbox" className="filter" value="less4" /> Less than 4 hours</label>
            <label><input type="checkbox" className="filter" value="4to6" /> 4-6 hours</label>
            <label><input type="checkbox" className="filter" value="more6" /> More than 6 hours</label>
          </details>

          <details>
            <summary>Skills Required</summary>
            <label><input type="checkbox" className="filter" value="basic" /> Basic</label>
            <label><input type="checkbox" className="filter" value="intermediate" /> Intermediate</label>
            <label><input type="checkbox" className="filter" value="advanced" /> Advanced</label>
          </details>

          <button className="btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
