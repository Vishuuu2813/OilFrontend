import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WorkedHistory.css";

const initialData = [
  { name: "Ravi Kumar", department: "Medical", date: "2024-04-01", shift: "Morning", status: "Pending" },
  { name: "Anita Sharma", department: "Exports", date: "2024-04-01", shift: "Evening", status: "Success" },
  { name: "Sunil Das", department: "Engineering", date: "2024-04-02", shift: "Night", status: "Pending" },
  { name: "Kavita Jain", department: "Medical", date: "2024-04-02", shift: "Morning", status: "Success" },
  { name: "Vikas Mehta", department: "HR", date: "2024-04-03", shift: "Night", status: "Pending" },
  { name: "Nisha Verma", department: "Exports", date: "2024-04-03", shift: "Evening", status: "Success" },
  { name: "Amit Saini", department: "Medical", date: "2024-04-04", shift: "Morning", status: "Pending" },
  { name: "Preeti Rao", department: "HR", date: "2024-04-04", shift: "Night", status: "Success" },
  { name: "Rohan Gupta", department: "Engineering", date: "2024-04-05", shift: "Evening", status: "Pending" },
  { name: "Meena Joshi", department: "Medical", date: "2024-04-05", shift: "Morning", status: "Success" },
];

const WorkedHistory = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentStatusFilter, setCurrentStatusFilter] = useState("All");

  const handleHideCard = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const exportCSV = () => {
    alert("Export CSV button clicked! (Export logic goes here)");
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shift.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      currentStatusFilter === "All" || item.status === currentStatusFilter;

    const matchesDate =
      (!fromDate || item.date >= fromDate) &&
      (!toDate || item.date <= toDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="worked-history">
      <h2>Worked History</h2>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name, shift or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button className="btn btn-date-filter" onClick={() => {}}>Filter Date</button>

        <div className="filter-buttons">
          <button className="btn btn-pending" onClick={() => setCurrentStatusFilter("Pending")}>Pending</button>
          <button className="btn btn-success" onClick={() => setCurrentStatusFilter("Success")}>Success</button>
          <button className="btn" onClick={() => setCurrentStatusFilter("All")}>Show All</button>
          <button className="btn btn-export" onClick={exportCSV}>Export as CSV</button>
        </div>
      </div>

      <div id="cardContainer">
        {filteredData.length === 0 ? (
          <p>No records found.</p>
        ) : (
          filteredData.map((item, index) => (
            <div className="card" key={index}>
              <button className="hide-btn" onClick={() => handleHideCard(index)}>Hide</button>
              <h4>{item.name}</h4>
              <div className="info">Department: {item.department}</div>
              <div className="info">Date: {item.date}</div>
              <div className="info">Shift: {item.shift}</div>
              <div className={`status ${item.status.toLowerCase()}`}>Status: {item.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkedHistory;
