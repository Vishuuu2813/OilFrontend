import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const DepartmentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter both email and password',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API call to verify credentials
      const response = await axios.post('https://oil-backend-maxf.vercel.appdepartment-login', {
        email,
        password
      });
      
      if (response.data.status === 'success') {
        // Store department info and token in localStorage
        localStorage.setItem('departmentToken', response.data.token);
        localStorage.setItem('departmentInfo', JSON.stringify(response.data.data));
        
        // Get the department details using the saved data
        const departmentId = response.data.data._id;
        
        // Fetch department details with the new token
        try {
          const departmentResponse = await axios.get(
            `https://oil-backend-maxf.vercel.appdepartments/${departmentId}`,
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`
              }
            }
          );
          
          if (departmentResponse.data.status === 'success') {
            // Update the department info with the complete data
            localStorage.setItem('departmentInfo', JSON.stringify({
              ...response.data.data,
              ...departmentResponse.data.data
            }));
          }
        } catch (detailsError) {
          console.error('Error fetching department details:', detailsError);
          // Continue with login even if details fetch fails
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login successful!',
          confirmButtonColor: '#4f46e5',
        });
        
        // Redirect to dashboard immediately
        navigate('/DepartmentDashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
          confirmButtonColor: '#4f46e5',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Department Login</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="form-container">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={`primary-button ${(!email || !password) ? 'disabled' : ''}`}
          >
            {isLoading ? (
              <span className="loader-container">
                <span className="loader"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="footer">
          <p>
            Need help? <a href="#" className="text-link">Contact Support</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e6f0ff 0%, #e6e6ff 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 420px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h2 {
          font-size: 28px;
          color: #333;
          margin: 0 0 10px 0;
        }

        .login-header p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d1d1;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .primary-button {
          width: 100%;
          padding: 12px 24px;
          background-color: #4f46e5;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 16px;
        }

        .primary-button:hover {
          background-color: #4338ca;
        }

        .primary-button.disabled {
          background-color: #a5a5a5;
          cursor: not-allowed;
        }

        .help-text {
          font-size: 14px;
          color: #666;
          margin: 6px 0 0 0;
        }

        .text-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          margin-left: 4px;
        }

        .text-link:hover {
          text-decoration: underline;
          color: #4338ca;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }

        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DepartmentLogin;