import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmploeeRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, contactNo, address, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !contactNo || !address || !password || !confirmPassword) {
      return Swal.fire('Error!', 'Please fill in all fields.', 'error');
    }

    if (password !== confirmPassword) {
      return Swal.fire('Error!', 'Passwords do not match.', 'error');
    }

    const data = {
      Fullname: name,
      Email: email,
      Contact: contactNo,
      Address: address,
      Password: password,
      Confirmpassword: confirmPassword
    };

    try {
      const res = await fetch('https://oil-backend-maxf.vercel.appregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.status === 409) {
        Swal.fire('Error!', result.message, 'error');
      } else if (res.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful',
          icon: 'success',
          confirmButtonText: 'Go to Login'
        }).then(() => navigate('/EmployeeLogin'));
      } else {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    } catch (err) {
      Swal.fire('Error!', 'Server Error', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Employee Registration</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Contact Number', name: 'contactNo', type: 'tel', placeholder: '+91 9876543210' }
          ].map((field, i) => (
            <div key={i} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                style={styles.input}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="123 Street Name, City"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.loginText}>
          Already registered? <span style={styles.loginLink} onClick={() => navigate('/EmployeeLogin')}>Login</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    overflowY: 'auto'
  },
  formContainer: {
    width: '100%',
    maxWidth: '550px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#444'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minHeight: '80px'
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1976d2',
    color: '#fff',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  loginText: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555'
  },
  loginLink: {
    color: '#1976d2',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default EmploeeRegister;
