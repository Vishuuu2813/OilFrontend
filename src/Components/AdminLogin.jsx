import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Admin ID",
        text: "Please enter your Admin ID",
      });
      return;
    }

    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Password",
        text: "Please enter your password",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/login-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome, ${data.admin.name}`,
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/Admindashboard");
        }, 1600);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Something went wrong",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Administrator Login</h1>
          <p>Secure access for administrative controls</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="adminId">Admin ID</label>
            <div className="input-container">
              <input 
                id="adminId"
                type="text" 
                value={adminId} 
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your admin ID"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container password-container">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <label className="remember-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            <a href="#">Security Policy</a> | <a href="#">Help & Support</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          font-family: 'Segoe UI', Arial, sans-serif;
        }

        .admin-login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 40px;
          box-sizing: border-box;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-login-header h1 {
          color: #1a3353;
          margin: 0 0 8px 0;
          font-weight: 600;
          font-size: 28px;
        }

        .admin-login-header p {
          color: #5a6a85;
          margin: 0;
          font-size: 15px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #344767;
          font-size: 14px;
          font-weight: 500;
        }

        .input-container {
          position: relative;
        }

        .password-container {
          display: flex;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d9e2ef;
          border-radius: 6px;
          font-size: 15px;
          color: #333;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #477EEA;
          box-shadow: 0 0 0 3px rgba(71, 126, 234, 0.15);
        }

        input::placeholder {
          color: #b0b7c3;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #5a6a85;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          width: auto;
        }

        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5a6a85;
          cursor: pointer;
        }

        .forgot-link {
          color: #477EEA;
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        button:active {
          transform: translateY(1px);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button {
          background-color: #477EEA;
          color: white;
        }

        .login-button:hover:not(:disabled) {
          background-color: #3c6cd4;
        }

        .admin-login-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: #5a6a85;
        }

        .admin-login-footer a {
          color: #477EEA;
          text-decoration: none;
        }

        .admin-login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 520px) {
          .admin-login-card {
            padding: 24px;
            margin: 16px;
          }
        }

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #477EEA;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
