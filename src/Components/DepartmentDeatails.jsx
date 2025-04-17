import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/DepartmentDeatails.css";

const DepartmentDeatails = () => {
  useEffect(() => {
    const total = document.querySelectorAll('#departmentTable tbody tr').length;
    document.getElementById("departmentCount").textContent = `Total Departments: ${total}`;
  }, []);

  return (
    <div className="container">
      <h2>Department Details</h2>
      <div className="count-box" id="departmentCount">Total Departments: 0</div>

      <table id="departmentTable">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Address</th>
            <th>Created On</th>
            <th>Enrolled</th>
            <th>Timings</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Engineering</td>
            <td>Block A, 2nd Floor</td>
            <td>2024-12-15</td>
            <td>23</td>
            <td>09:00 AM - 05:00 PM</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>HR Department</td>
            <td>Block B, 1st Floor</td>
            <td>2025-01-10</td>
            <td>12</td>
            <td>10:00 AM - 06:00 PM</td>
            <td>Admin</td>
          </tr>
          <tr>
            <td>Maintenance</td>
            <td>Ground Floor</td>
            <td>2025-03-02</td>
            <td>9</td>
            <td>08:00 AM - 04:00 PM</td>
            <td>Support</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentDeatails;
