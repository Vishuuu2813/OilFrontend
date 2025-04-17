import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExclamationCircle,
  faShare,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

const BookedShifts = () => {
  const { departmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const departmentName = location.state?.departmentName || "Unknown Department";
  
  const [complainModalOpen, setComplainModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);
  
  // Mock data - in real application, fetch from API based on departmentId
  const [allShifts, setAllShifts] = useState([
    {
      id: "1",
      department: "Medical",
      departmentId: "med123",
      user: "User A",
      shift: "Morning",
      numberOfShifts: 3,
      rechargeAmount: 1500,
    },
    {
      id: "2",
      department: "Medical",
      departmentId: "med123",
      user: "User D",
      shift: "Evening",
      numberOfShifts: 1,
      rechargeAmount: 800,
    },
    {
      id: "3",
      department: "Engineering",
      departmentId: "eng456",
      user: "User B",
      shift: "Evening",
      numberOfShifts: 2,
      rechargeAmount: 1200,
    },
    {
      id: "4",
      department: "Exports",
      departmentId: "exp789",
      user: "User C",
      shift: "Night",
      numberOfShifts: 4,
      rechargeAmount: 2000,
    },
  ]);
  
  const [bookedShifts, setBookedShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter shifts based on departmentId
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      if (departmentId) {
        const filteredShifts = allShifts.filter(shift => shift.departmentId === departmentId);
        setBookedShifts(filteredShifts);
      } else {
        setBookedShifts(allShifts);
      }
      setLoading(false);
    }, 500);
    
    // In a real app, you would fetch data from API
    // const fetchShifts = async () => {
    //   try {
    //     const response = await axios.get(`https://oil-backend-maxf.vercel.appshifts/${departmentId}`);
    //     if (response.data.status === 'success') {
    //       setBookedShifts(response.data.data);
    //     }
    //     setLoading(false);
    //   } catch (err) {
    //     console.error('Error fetching shifts:', err);
    //     setLoading(false);
    //   }
    // };
    // fetchShifts();
    
  }, [departmentId, allShifts]);

  const openComplainModal = (shift) => {
    setSelectedShift(shift);
    setComplainModalOpen(true);
  };
  
  const closeComplainModal = () => {
    setComplainModalOpen(false);
    setSelectedShift(null);
  };

  const openShareModal = (shift) => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const link = `https://shiftbooked.com/share/${shift.department.toLowerCase()}-${shift.user.toLowerCase().replace(/\s/g, "")}-${randomString}`;
    setShareLink(link);
    setSelectedShift(shift);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setSelectedShift(null);
  };

  const submitComplain = (e) => {
    e.preventDefault();
    const name = e.target.empName.value;
    const mobile = e.target.empMobile.value;
    const complaint = e.target.empComplain.value;

    alert(`Complaint submitted:\nDepartment: ${selectedShift.department}\nName: ${name}\nMobile: ${mobile}\nComplaint: ${complaint}`);
    e.target.reset();
    closeComplainModal();
  };

  const hideShift = (shiftId) => {
    setBookedShifts(bookedShifts.filter((shift) => shift.id !== shiftId));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };
  
  const goBackToDepartments = () => {
    navigate(-1);
  };

  // Loading component
  const LoadingState = () => (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading shifts...</p>
    </div>
  );

  return (
    <div style={styles.bookedShifts}>
      <div style={styles.header}>
        <button 
          style={styles.backButton} 
          onClick={goBackToDepartments}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={styles.backIcon} />
          Back to Departments
        </button>
        <h2 style={styles.pageTitle}>{departmentName} Shifts</h2>
      </div>

      {loading ? (
        <LoadingState />
      ) : bookedShifts.length > 0 ? (
        <div style={styles.cardContainer}>
          {bookedShifts.map((shift) => (
            <div style={styles.shiftCard} key={shift.id}>
              <h4 style={styles.cardTitle}>{shift.department} Department</h4>
              <div style={styles.shiftInfo}><strong>User:</strong> {shift.user}</div>
              <div style={styles.shiftInfo}><strong>Shift:</strong> {shift.shift}</div>
              <div style={styles.shiftInfo}><strong>No. of Shifts:</strong> {shift.numberOfShifts}</div>
              <div style={styles.shiftInfo}><strong>Recharge Amount:</strong> ₹{shift.rechargeAmount}</div>
              <div style={styles.buttonGroup}>
                <button 
                  style={styles.complainBtn} 
                  onClick={() => openComplainModal(shift)}
                >
                  <FontAwesomeIcon icon={faExclamationCircle} style={styles.buttonIcon} /> Complain
                </button>
                <button 
                  style={styles.hideBtn} 
                  onClick={() => hideShift(shift.id)}
                >
                  <FontAwesomeIcon icon={faEyeSlash} style={styles.buttonIcon} /> Hide
                </button>
                <button 
                  style={styles.shareBtn} 
                  onClick={() => openShareModal(shift)}
                >
                  <FontAwesomeIcon icon={faShare} style={styles.buttonIcon} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noShifts}>
          <FontAwesomeIcon icon={faEye} size="3x" style={styles.noShiftsIcon} />
          <h3 style={styles.noShiftsTitle}>No shifts found</h3>
          <p style={styles.noShiftsText}>
            There are no booked shifts for {departmentName} department at the moment.
          </p>
          <button 
            style={styles.bookNowButton} 
            onClick={goBackToDepartments}
          >
            Browse Departments
          </button>
        </div>
      )}

      {/* Complaint Modal */}
      {complainModalOpen && selectedShift && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && closeComplainModal()}>
          <div style={styles.modalContent}>
            <span style={styles.close} onClick={closeComplainModal}>&times;</span>
            <h3 style={styles.modalTitle}>Submit a Complaint</h3>
            <p style={styles.modalSubtitle}>Department: {selectedShift.department}</p>
            <form onSubmit={submitComplain}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="empName">Employee Name</label>
                <input style={styles.formInput} type="text" id="empName" name="empName" required />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="empMobile">Mobile Number</label>
                <input style={styles.formInput} type="tel" id="empMobile" name="empMobile" required />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="empComplain">Complaint</label>
                <textarea style={styles.formTextarea} id="empComplain" name="empComplain" rows="4" required></textarea>
              </div>

              <button style={styles.btnSubmit} type="submit">Submit Complaint</button>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && selectedShift && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && closeShareModal()}>
          <div style={styles.modalContent}>
            <span style={styles.close} onClick={closeShareModal}>&times;</span>
            <h3 style={styles.modalTitle}>Share This Shift</h3>
            <p style={styles.modalSubtitle}>{selectedShift.department} - {selectedShift.shift} Shift</p>
            <input style={styles.shareInput} type="text" value={shareLink} readOnly />
            <button style={styles.btnSubmit} onClick={copyLink}>Copy Link</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal CSS styles object
const styles = {
  bookedShifts: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px'
  },
  
  backButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '20px'
  },
  
  backIcon: {
    marginRight: '8px'
  },
  
  pageTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
    color: '#1f2937'
  },
  
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  
  shiftCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  
  cardTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '10px'
  },
  
  shiftInfo: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '8px'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  
  complainBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease'
  },
  
  hideBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease'
  },
  
  shareBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease'
  },
  
  buttonIcon: {
    marginRight: '6px'
  },
  
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  
  modalContent: {
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  },
  
  close: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#9ca3af',
    cursor: 'pointer'
  },
  
  modalTitle: {
    margin: '0 0 5px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1f2937'
  },
  
  modalSubtitle: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '15px'
  },
  
  formGroup: {
    marginBottom: '20px'
  },
  
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#4b5563'
  },
  
  formInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  
  formTextarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    resize: 'vertical'
  },
  
  btnSubmit: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4a6cf7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  
  shareInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    backgroundColor: '#f9fafb'
  },
  
  // No shifts found
  noShifts: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  
  noShiftsIcon: {
    color: '#d1d5db',
    marginBottom: '20px'
  },
  
  noShiftsTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1f2937',
    margin: '0 0 10px 0'
  },
  
  noShiftsText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 20px 0'
  },
  
  bookNowButton: {
    padding: '10px 20px',
    backgroundColor: '#4a6cf7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  
  // Loading state
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #4a6cf7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  
  loadingText: {
    fontSize: '16px',
    color: '#6b7280'
  },
  
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

export default BookedShifts;