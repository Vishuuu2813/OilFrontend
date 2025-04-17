import React, { useState } from 'react';

const TrainingBox = () => {
  // Sample referral data
  const [referralData, setReferralData] = useState([
    {
      name: 'John Doe',
      shiftsBooked: 5,
      shiftPrice: 100,
      rewardPercentage: 20, // in percent
    },
    {
      name: 'Jane Smith',
      shiftsBooked: 3,
      shiftPrice: 120,
      rewardPercentage: 10,
    },
    {
      name: 'Bob Johnson',
      shiftsBooked: 4,
      shiftPrice: 80,
      rewardPercentage: 15,
    },
  ]);

  // Calculate total rewards
  const calculateReward = (shiftPrice, shiftsBooked, rewardPercentage) => {
    return ((shiftPrice * shiftsBooked) * rewardPercentage) / 100;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Training Box (Referral Rewards)</h2>
      <p style={styles.description}>
        Track your referral training progress and see your earnings based on shifts booked by your referrals.
      </p>
      <div style={styles.cardContainer}>
        {referralData.map((referral, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.name}>{referral.name}</h3>
            <p style={styles.text}>Shifts Booked: {referral.shiftsBooked}</p>
            <p style={styles.text}>Shift Price: ₹{referral.shiftPrice}</p>
            <p style={styles.text}>Reward Percentage: {referral.rewardPercentage}%</p>
            <p style={styles.reward}>
              Total Reward: ₹
              {calculateReward(referral.shiftPrice, referral.shiftsBooked, referral.rewardPercentage).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline CSS
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#666',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    width: '250px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  name: {
    margin: '0 0 10px',
    color: '#007bff',
  },
  text: {
    margin: '5px 0',
    color: '#444',
  },
  reward: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#28a745',
  },
};

export default TrainingBox;
