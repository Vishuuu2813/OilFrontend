import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function NotificationMaker() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(5); // Notifications per page

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((notif) =>
    notif.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Submit new or updated notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      Swal.fire('Error', 'Please fill in both fields', 'error');
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/edit-notification/${editId}`, { title, description });
        Swal.fire('Updated!', 'Notification updated successfully', 'success');
        setEditId(null);
      } else {
        await axios.post('http://localhost:8000/api/add-notification', { title, description });
        Swal.fire('Success', 'Notification added successfully', 'success');
      }

      setTitle('');
      setDescription('');
      fetchNotifications();
    } catch (err) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  // Delete a notification
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the notification.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/delete-notification/${id}`);
          Swal.fire('Deleted!', 'Notification deleted.', 'success');
          fetchNotifications();
        } catch (err) {
          Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  // Populate data for editing
  const handleEdit = (notif) => {
    setTitle(notif.title);
    setDescription(notif.description);
    setEditId(notif._id);
  };

  return (
    <div className="notification-maker-container">
      <h2>{editId ? 'Edit Notification' : 'Create Notification'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Notification Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <button type="submit">{editId ? 'Update Notification' : 'Add Notification'}</button>
      </form>

      <hr />

      <h3>All Notifications</h3>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      
      {filteredNotifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="notifications-list">
          {currentNotifications.map((notif) => (
            <li key={notif._id} className="notification-card">
              <h4>{notif.title}</h4>
              <p>{notif.description}</p>
              <div className="actions">
                <button onClick={() => handleEdit(notif)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(notif._id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredNotifications.length / notificationsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <style>
        {`
          .notification-maker-container {
            padding: 2rem;
            max-width: 700px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }

          h2 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
          }

          h3 {
            margin-top: 2rem;
            font-size: 1.25rem;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          input, textarea {
            padding: 0.5rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          button {
            padding: 0.7rem 1.2rem;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          button:hover {
            background-color: #45a049;
          }

          /* Search input */
          .search-input {
            padding: 0.7rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 2rem;
          }

          /* List of notifications */
          .notifications-list {
            list-style: none;
            padding: 0;
          }

          .notification-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            background-color: #f9f9f9;
          }

          .notification-card h4 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
          }

          .notification-card p {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .actions {
            display: flex;
            gap: 1rem;
          }

          .edit-btn {
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .edit-btn:hover {
            background-color: #0056b3;
          }

          .delete-btn {
            padding: 0.5rem 1rem;
            background-color: red;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .delete-btn:hover {
            background-color: darkred;
          }

          /* Pagination styles */
          .pagination {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
          }

          .page-btn {
            padding: 0.5rem 1rem;
            margin: 0 5px;
            background-color: #ddd;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .page-btn:hover {
            background-color: #bbb;
          }

          .page-btn.active {
            background-color: #4CAF50;
            color: white;
          }
        `}
      </style>
    </div>
  );
}

export default NotificationMaker;
