import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/BlockD.css";

const BlockDepartment = () => {
  const [blockedDepartments, setBlockedDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!department || !reason.trim()) return;

    const now = new Date();
    const newBlock = {
      id: Date.now(),
      department,
      reason: reason.trim(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    setBlockedDepartments([...blockedDepartments, newBlock]);

    // Reset form
    setDepartment("");
    setReason("");
  };

  const unblockDepartment = (id) => {
    const updatedList = blockedDepartments.filter(item => item.id !== id);
    setBlockedDepartments(updatedList);
  };

  return (
    <div className="block-department-container">
      <h1>Block Department</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="department">Select Department to Block:</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">-- Select Department --</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="Customer Support">Customer Support</option>
          </select>

          <label htmlFor="reason">Reason for Blocking:</label>
          <textarea
            id="reason"
            placeholder="Write the reason why you're blocking this department..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <button type="submit">Block Department</button>
        </form>
      </div>

      <div className="list-container">
        <h2>Blocked Departments</h2>
        <ul className="blocked-list">
          {blockedDepartments.map((item) => (
            <li className="blocked-item" key={item.id}>
              <div className="blocked-details">
                <strong>{item.department}</strong>
                <small>
                  <strong>Date:</strong> {item.date} <strong>Time:</strong> {item.time}
                </small>
                <small>
                  <strong>Reason:</strong> {item.reason}
                </small>
              </div>
              <button
                className="unblock-btn"
                onClick={() => unblockDepartment(item.id)}
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Example Link to go to another page */}
      {/* <Link to="/dashboard">Go to Dashboard</Link> */}
    </div>
  );
};

export default BlockDepartment;
