import React, { useState } from 'react';
import axios from 'axios';

function RechargeManager() {
  const [formData, setFormData] = useState({
    planName: '',
    amount: '',
    numberOfShifts: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/add-recharge-plan', formData);
      alert('Recharge plan created!');
      setFormData({
        planName: '',
        amount: '',
        numberOfShifts: '',
        description: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create plan.');
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          padding: 30px;
          max-width: 600px;
          margin: auto;
          font-family: Arial;
        }
        h2 {
          text-align: center;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }
        input, textarea, button {
          padding: 10px;
          font-size: 16px;
        }
        button {
          background-color: #1e88e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>

      <h2>Create Recharge Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="planName"
          placeholder="Plan Name"
          value={formData.planName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="numberOfShifts"
          placeholder="Number of Shifts"
          value={formData.numberOfShifts}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Add Plan</button>
      </form>
    </div>
  );
}

export default RechargeManager;
