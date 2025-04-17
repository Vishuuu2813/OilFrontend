import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Link } from 'react-router-dom';
import './CSS/Paym.css';

const PaymentDeatails = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [profile, setProfile] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const profiles = {};

  const generateUniqueId = (prefix) => `${prefix}${Math.floor(Math.random() * 1000000)}`;

  const generateProfile = async () => {
    if (!employeeName || !departmentName) {
      alert('Please enter both Employee Name and Department Name');
      return;
    }

    const empId = generateUniqueId('EMP');
    const deptId = generateUniqueId('DEP');
    const profileLink = `https://company.com/profile/${empId}`;

    const newProfile = { name: employeeName, department: departmentName, empId, deptId, profileLink };
    profiles[empId] = newProfile;
    profiles[deptId] = newProfile;

    setProfile(newProfile);

    const qrCode = await QRCode.toDataURL(profileLink);
    setQrCodeUrl(qrCode);
  };

  const searchProfile = () => {
    if (profiles[searchInput]) {
      setSearchResult(profiles[searchInput]);
    } else {
      setSearchResult('not found');
    }
  };

  return (
    <div className="container">
      <h2>Employee Profile Page</h2>

      <div className="profile">
        <label>Employee Name:</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Enter Employee Name"
        />
        <br /><br />

        <label>Department Name:</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Enter Department Name"
        />
        <br /><br />

        <button onClick={generateProfile}>Generate Profile</button>

        {profile && (
          <div className="profile-details">
            <h3>Your Profile Details:</h3>
            <p><strong>Employee ID:</strong> {profile.empId}</p>
            <p><strong>Department ID:</strong> {profile.deptId}</p>
            <p><strong>Profile Link:</strong> <Link to={profile.profileLink}>{profile.profileLink}</Link></p>
            {qrCodeUrl && (
              <div className="qr">
                <strong>QR Code:</strong>
                <br />
                <img src={qrCodeUrl} alt="QR Code" />
              </div>
            )}
          </div>
        )}
      </div>

      <h3>Search Profile by Employee ID or Department ID:</h3>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter Employee ID or Department ID"
      />
      <button onClick={searchProfile}>Search</button>

      {searchResult && (
        <div className="search-result">
          {searchResult === 'not found' ? (
            <>No profile found for: {searchInput}</>
          ) : (
            <>
              <strong>Employee Name:</strong> {searchResult.name} <br />
              <strong>Department Name:</strong> {searchResult.department} <br />
              <strong>Employee ID:</strong> {searchResult.empId} <br />
              <strong>Department ID:</strong> {searchResult.deptId} <br />
              <strong>Profile Link:</strong> <Link to={searchResult.profileLink}>{searchResult.profileLink}</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentDeatails;
