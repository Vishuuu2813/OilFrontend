import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/ComplainDepartment.css";

const initialComplaints = [
  {
    id: 1,
    name: "Ravi Kumar",
    mobile: "9876543210",
    text: "Shift booking issue in Engineering.",
    status: "Pending",
    date: "2024-04-01",
    reply: "",
  },
  {
    id: 2,
    name: "Anita Sharma",
    mobile: "9123456780",
    text: "Recharge not showing in dashboard.",
    status: "In Progress",
    date: "2024-04-02",
    reply: "",
  },
  {
    id: 3,
    name: "Sunil Das",
    mobile: "9090909090",
    text: "Worked shift not appearing in history.",
    status: "Solved",
    date: "2024-04-03",
    reply: "This is fixed now.",
  },
];

export default function ComplainDepartment() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentStatusFilter, setCurrentStatusFilter] = useState("All");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReplyId, setCurrentReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.text.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      currentStatusFilter === "All" || c.status === currentStatusFilter;

    const matchesDate =
      (!fromDate || c.date >= fromDate) && (!toDate || c.date <= toDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const openReplyModal = (id) => {
    setCurrentReplyId(id);
    setReplyText("");
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
  };

  const submitReply = () => {
    if (!replyText.trim()) {
      alert("Please enter a reply.");
      return;
    }

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === currentReplyId
          ? { ...c, reply: replyText, status: "Solved" }
          : c
      )
    );
    closeReplyModal();
  };

  const updateProgress = (id) => {
    const newStatus = prompt("Enter new status (Pending, In Progress, Solved):");
    if (!["Pending", "In Progress", "Solved"].includes(newStatus)) {
      alert("Invalid status!");
      return;
    }

    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.className === "modal") {
        closeReplyModal();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="container">
      <h2>Complain Department</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, mobile or complaint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        {["All", "Pending", "In Progress", "Solved"].map((status) => (
          <button key={status} onClick={() => setCurrentStatusFilter(status)}>
            {status}
          </button>
        ))}
      </div>

      <div id="complainList">
        {filteredComplaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          filteredComplaints.map((complaint) => (
            <div className="complain-card" key={complaint.id}>
              <h4>
                {complaint.name} ({complaint.mobile})
              </h4>
              <div className="info">
                <strong>Date:</strong> {complaint.date}
              </div>
              <div className="info">Complaint: {complaint.text}</div>
              <div className="status">Status: {complaint.status}</div>
              {complaint.reply && (
                <div className="info">
                  <strong>Reply:</strong> {complaint.reply}
                </div>
              )}
              <button
                className="btn reply-btn"
                onClick={() => openReplyModal(complaint.id)}
              >
                Reply
              </button>
              <button
                className="btn progress-btn"
                onClick={() => updateProgress(complaint.id)}
              >
                Update Progress
              </button>
            </div>
          ))
        )}
      </div>

      {replyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeReplyModal}>
              &times;
            </span>
            <h3>Reply to Complaint</h3>
            <textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button className="btn-submit" onClick={submitReply}>
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
