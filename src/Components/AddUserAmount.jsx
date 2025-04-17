import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddUserAmount() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');

  // ✅ Fetch users on mount
  useEffect(() => {
    axios.get('http://localhost:8000/employees')
      .then(res => {
        if (res.data.status === 'success') {
          setUsers(res.data.data);
        } else {
          Swal.fire('Error', 'Failed to fetch user data', 'error');
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        Swal.fire('Error', 'Failed to load users', 'error');
      });
  }, []);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !amount) {
      Swal.fire('Warning', 'Please select a user and enter amount.', 'warning');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/add-user-amount', {
        userId: selectedUser,
        amount: parseFloat(amount),
      });

      Swal.fire('Success', 'Amount added successfully', 'success');
      setSelectedUser('');
      setAmount('');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to add amount', 'error');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add Amount to User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.fullname || user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600"
        >
          Add Amount
        </button>
      </form>
    </div>
  );
}

export default AddUserAmount;
