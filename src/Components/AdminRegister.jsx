import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    facebook: '',
    twitter: '',
    linkedin: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const { name, email, contact } = formData;
    if (!name || !email || !contact) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('https://oil-backend-maxf.vercel.appregister-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Admin registered successfully');
        navigate('/admin-dashboard');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="admin-profile-container">
      <h2 className="admin-heading">Admin Profile</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} /><br /><br />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} /><br /><br />

        
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} /><br /><br />

        <label>Contact:</label>
        <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
   

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
