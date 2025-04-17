import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter both email/contact and password',
        icon: 'error',
        confirmButtonColor: '#4a6cf7'
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email: email, Password: password })
      });

      const result = await res.json();

      if (result.status === 'success') {
        // Store token and user data in localStorage
        localStorage.setItem('token', result.token);
        
        // Make sure walletBalance is included in the response
        const userDataWithWallet = {
          ...result.data,
          walletBalance: result.data.walletBalance || 0
        };
        
        localStorage.setItem('userData', JSON.stringify(userDataWithWallet));
        
        Swal.fire({
          title: 'Success!',
          text: 'Login successful',
          icon: 'success',
          confirmButtonColor: '#4a6cf7'
        }).then(() => {
          navigate('/Home');
        });
      } else {
        Swal.fire({
          title: 'Login Failed!',
          text: result.message,
          icon: 'error',
          confirmButtonColor: '#4a6cf7'
        });
      }

    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire({
        title: 'Server Error!',
        text: 'Unable to connect to the server',
        icon: 'error',
        confirmButtonColor: '#4a6cf7'
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Employee Login</h1>
        <p style={styles.subheading}>Welcome back! Please login to your account</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email or Contact Number</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter email or contact"
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

          <div style={styles.forgotPasswordContainer}>
            <span style={styles.forgotPassword}>Forgot password?</span>
          </div>

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.registerText}>
          Don't have an account?{' '}
          <span style={styles.registerLink} onClick={() => navigate('/EmployeeRegister')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px'
  },
  formContainer: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    padding: '40px'
  },
  heading: {
    color: '#333',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subheading: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#333',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  forgotPasswordContainer: {
    textAlign: 'right',
    marginBottom: '20px'
  },
  forgotPassword: {
    color: '#4a6cf7',
    fontSize: '14px',
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4a6cf7',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  registerText: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
    color: '#666'
  },
  registerLink: {
    color: '#4a6cf7',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default EmployeeLogin;