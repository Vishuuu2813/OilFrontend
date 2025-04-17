import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Wallet() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get('https://oil-backend-maxf.vercel.apprecharge-plans')
      .then(res => setPlans(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="wallet-container">
      <style>{`
        .wallet-container {
          padding: 40px 20px;
          background-color: #f9f9f9;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .wallet-title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .wallet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .wallet-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 24px;
          transition: 0.3s ease;
        }

        .wallet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        .wallet-card-title {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .wallet-card-description {
          font-size: 14px;
          margin-bottom: 10px;
          color: #555;
        }

        .wallet-card-price {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .wallet-card-shifts {
          font-size: 14px;
          margin-bottom: 15px;
        }

        .wallet-card-button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 15px;
          background-color: #1e88e5;
          color: white;
        }
      `}</style>

      <h2 className="wallet-title">Recharge Plans</h2>
      <div className="wallet-grid">
        {plans.map((plan, index) => (
          <div className="wallet-card" key={index}>
            <h3 className="wallet-card-title">{plan.planName}</h3>
            <p className="wallet-card-description">{plan.description}</p>
            <p className="wallet-card-price">₹{plan.amount}</p>
            <p className="wallet-card-shifts">{plan.numberOfShifts} Shifts</p>
            <button className="wallet-card-button">Get Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wallet;
