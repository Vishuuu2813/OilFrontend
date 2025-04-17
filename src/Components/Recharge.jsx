// RechargePage.jsx
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const RechargePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { department } = location.state || {};

  if (!department) {
    return (
      <div style={styles.wrapper}>
        <h2>Department not found</h2>
        <p>Data might not be passed correctly. Please try again from the Department list page.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2>Booking Shift for: {department.name}</h2>
      <div style={styles.detailsBox}>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Category:</strong> {department.category}</p>
        <p><strong>Location:</strong> {department.location}</p>
        <p><strong>Shift Hours:</strong> {department.shiftHours}</p>
        <p><strong>Number of Shifts:</strong> {department.numberOfShifts}</p>
        {department.reasonForShift && (
          <div style={styles.infoBox}>
            <strong>Reason for Offering This Shift (Temporary):</strong>
            <p>{department.reasonForShift}</p>
          </div>
        )}
        {department.temporaryValidityHours && (
          <div style={styles.infoBox}>
            <strong>Temporary Validity:</strong>
            <p>{department.temporaryValidityHours} hours</p>
          </div>
        )}
        {department.keywords && (
          <div style={styles.infoBox}>
            <strong>Keywords:</strong>
            <p>{department.keywords.join(', ')}</p>
          </div>
        )}
        {/* Add more fields or booking form here */}
      </div>
      {/* You might add a booking form or confirmation button here */}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
  },
  detailsBox: {
    marginTop: '20px',
    background: '#f1f1f1',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  infoBox: {
    marginTop: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#e9e9e9',
  },
};

export default RechargePage;

// Keywords for this component:
// Recharge, Shift Booking, Department Details, Shift Information 