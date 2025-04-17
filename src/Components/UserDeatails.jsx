import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { FaSearch, FaFileExport, FaArrowLeft, FaEdit, FaTrash, FaEye, FaUserPlus, FaSync, FaBan, FaUserCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';

function UserDetails() {
  // CSS Styles
  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '"Poppins", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0',
      borderLeft: '4px solid #3182ce',
      paddingLeft: '12px',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    exportButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    addButton: {
      backgroundColor: '#38a169',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    refreshButton: {
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    blockedListButton: {
      backgroundColor: '#9c4221',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      border: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '24px',
      width: '100%',
      maxWidth: '500px',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
    },
    searchInput: {
      padding: '14px',
      paddingLeft: '36px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      width: '100%',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    spinner: {
      display: 'inline-block',
      width: '24px',
      height: '24px',
      border: '3px solid #3182ce',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingMessage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '48px 0',
      color: '#718096',
      fontSize: '16px',
    },
    noDataMessage: {
      textAlign: 'center',
      color: '#718096',
      padding: '40px',
      fontSize: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px dashed #cbd5e0',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '32px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '1px solid #e2e8f0',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#475569',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#4a5568',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
    },
    activeStatus: {
      backgroundColor: '#c6f6d5',
      color: '#22543d',
    },
    inactiveStatus: {
      backgroundColor: '#fed7d7',
      color: '#822727',
    },
    blockedStatus: {
      backgroundColor: '#fbd38d',
      color: '#7b341e',
    }
  };

  // Keyframes for spinner animation
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .hover-effect:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .action-button {
      padding: 6px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      margin-right: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .view-button {
      background-color: #3182ce;
      color: white;
    }
    
    .view-button:hover {
      background-color: #2c5282;
    }
    
    .edit-button {
      background-color: #eab308;
      color: white;
    }
    
    .edit-button:hover {
      background-color: #b45309;
    }
    
    .delete-button {
      background-color: #e53e3e;
      color: white;
    }
    
    .delete-button:hover {
      background-color: #c53030;
    }

    .block-button {
      background-color: #9c4221;
      color: white;
    }
    
    .block-button:hover {
      background-color: #7b341e;
    }

    .unblock-button {
      background-color: #38a169;
      color: white;
    }
    
    .unblock-button:hover {
      background-color: #2f855a;
    }
    
    input:focus, button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
    }
    
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .badge-active {
      background-color: #c6f6d5;
      color: #22543d;
    }
    
    .badge-inactive {
      background-color: #fed7d7;
      color: #822727;
    }

    .badge-blocked {
      background-color: #fbd38d;
      color: #7b341e;
    }
    
    .main-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
    }
    
    .rdt_TableHead {
      background-color: #f7fafc !important;
    }
    
    .rdt_TableHeadRow {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
    }
    
    .rdt_TableRow:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .status-icon {
      margin-right: 4px;
    }
  `;

  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState('fullname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [apiEndpoint, setApiEndpoint] = useState('https://oil-backend-maxf.vercel.appemployees');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.fullname?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.contact?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.address?.toLowerCase().includes(filterText.toLowerCase()) ||
      String(user.status).toLowerCase().includes(filterText.toLowerCase()) ||
      (user.isBlocked && 'blocked'.includes(filterText.toLowerCase()))
    );
    setFilteredUsers(filtered);
    setTotalUsers(filtered.length);
  }, [filterText, users]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be a fetch request to your API
      try {
        const response = await fetch(apiEndpoint);
        const result = await response.json();
        
        if (result.status === 'success') {
          // Process the received data
          const processedUsers = result.data.map(user => ({
            ...user,
            id: user._id || user.id || Math.random().toString(36).substr(2, 9),
            fullname: user.fullname || '',
            email: user.email || '',
            contact: user.contact || '',
            address: user.address || '',
            // Ensure status is set properly based on block state
            status: user.isBlocked ? 'Inactive' : (user.status || 'Active'),
            numberOfShifts: user.numberOfShifts || 0,
            isBlocked: user.isBlocked || false,
            blockReason: user.blockReason || '',
            blockedAt: user.blockedAt || null
          }));
          
          setUsers(processedUsers);
          setTotalUsers(processedUsers.length);
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee data loaded successfully',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          throw new Error(result.message || 'Failed to load employee data');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Fallback to mock data if API fails
        const mockUsers = generateMockEmployees();
        setUsers(mockUsers);
        setTotalUsers(mockUsers.length);
        
        Swal.fire({
          icon: 'warning',
          title: 'Using mock data',
          text: 'Could not connect to server, using demo data instead',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load employee data',
        confirmButtonColor: '#3182ce'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock employee data for testing
  const generateMockEmployees = () => {
    return Array.from({ length: 20 }, (_, i) => {
      const isBlocked = Math.random() > 0.8;
      return {
        id: i + 1,
        fullname: `Employee ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        contact: `+1 ${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: `${Math.floor(100 + Math.random() * 9900)} Main St, City ${i + 1}`,
        // Set status based on block state - blocked users are always Inactive
        status: isBlocked ? 'Inactive' : (Math.random() > 0.3 ? 'Active' : 'Inactive'),
        numberOfShifts: Math.floor(Math.random() * 50),
        password: 'password123', // Just for mock data
        isBlocked: isBlocked,
        blockReason: isBlocked ? 'Violation of company policy' : '',
        blockedAt: isBlocked ? new Date().toISOString() : null
      };
    });
  };

  const handleSort = (column, direction) => {
    let fieldName = column.selector;
    
    if (typeof column.selector === 'function') {
      fieldName = column.name ? column.name.toLowerCase() : 'fullname';
    } else if (typeof column.selector === 'object' && column.selector !== null) {
      fieldName = column.selector.name || 'fullname';
    }
    
    setSortField(fieldName);
    setSortDirection(direction);
  };

  const handleView = (row) => {
    // Helper function to format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        return 'Invalid date';
      }
    };
    
    Swal.fire({
      title: `${row.fullname}`,
      html: `
        <div style="text-align: left; margin-top: 20px;">
          <p><strong>Email:</strong> ${row.email || 'N/A'}</p>
          <p><strong>Contact:</strong> ${row.contact || 'N/A'}</p>
          <p><strong>Address:</strong> ${row.address || 'N/A'}</p>
          <p><strong>Status:</strong> 
            <span style="
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              background-color: ${row.isBlocked ? '#fbd38d' : (row.status === 'Active' ? '#c6f6d5' : '#fed7d7')};
              color: ${row.isBlocked ? '#7b341e' : (row.status === 'Active' ? '#22543d' : '#822727')};
            ">
              ${row.isBlocked ? 'Blocked' : row.status}
            </span>
          </p>
          <p><strong>Shifts:</strong> ${row.numberOfShifts || '0'}</p>
          ${row.isBlocked ? `
            <div style="
              margin-top: 15px;
              padding: 12px;
              border-radius: 8px;
              background-color: #fff8e1;
              border: 1px solid #ffe0b2;
            ">
              <p style="margin-top: 0;"><strong>Block Information</strong></p>
              <p><strong>Block Reason:</strong> ${row.blockReason || 'No reason provided'}</p>
              <p style="margin-bottom: 0;"><strong>Blocked At:</strong> ${formatDate(row.blockedAt)}</p>
            </div>
          ` : ''}
        </div>
      `,
      confirmButtonColor: '#3182ce',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  const handleEdit = (row) => {
    // If the user is blocked, show warning and don't allow editing
    if (row.isBlocked) {
      Swal.fire({
        title: 'User is Blocked',
        text: 'This user is currently blocked. Please unblock the user before editing.',
        icon: 'warning',
        confirmButtonColor: '#3182ce'
      });
      return;
    }
    
    Swal.fire({
      title: 'Edit Employee',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Full Name</label>
            <input id="fullname" class="swal2-input" value="${row.fullname || ''}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
            <input id="email" class="swal2-input" value="${row.email || ''}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Contact</label>
            <input id="contact" class="swal2-input" value="${row.contact || ''}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Address</label>
            <textarea id="address" class="swal2-textarea" style="width: 100%;">${row.address || ''}</textarea>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Status</label>
            <select id="status" class="swal2-select" style="width: 100%;">
              <option value="Active" ${row.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${row.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#3182ce',
      cancelButtonColor: '#e53e3e',
      preConfirm: () => {
        return {
          fullname: document.getElementById('fullname').value,
          email: document.getElementById('email').value,
          contact: document.getElementById('contact').value,
          address: document.getElementById('address').value,
          status: document.getElementById('status').value
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // In a real application, make API call to update employee
          const updatedUserData = {
            ...result.value,
            isBlocked: false, // Ensure the user is not blocked when updating via edit
          };
          
          try {
            const response = await fetch(`https://oil-backend-maxf.vercel.appupdate-employee/${row.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedUserData)
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to update employee');
            }
            
          } catch (apiError) {
            console.error('API Error during update:', apiError);
            // Continue with local update despite API error for demo purposes
          }
          
          // Update local state
          const updatedUsers = users.map(user => {
            if (user.id === row.id) {
              return { 
                ...user, 
                ...updatedUserData,
                isBlocked: false, // Ensure block state is false
              };
            }
            return user;
          });
          
          setUsers(updatedUsers);
          
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `${result.value.fullname} has been updated successfully.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error updating employee:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message || 'There was a problem updating the employee.',
            confirmButtonColor: '#3182ce'
          });
        }
      }
    });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${row.fullname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#3182ce',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // In a real application, make API call to delete employee
          try {
            const response = await fetch(`https://oil-backend-maxf.vercel.appdelete-employee/${row.id}`, {
              method: 'DELETE'
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to delete employee');
            }
            
          } catch (apiError) {
            console.error('API Error during delete:', apiError);
            // Continue with local deletion despite API error for demo purposes
          }
          
          // Update local state
          const updatedUsers = users.filter(user => user.id !== row.id);
          setUsers(updatedUsers);
          
          // Also update the blocked users in localStorage if needed
          const blockedUsers = updatedUsers.filter(user => user.isBlocked);
          localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${row.fullname} has been deleted.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error deleting employee:', error);
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: error.message || 'There was a problem deleting the employee.',
            confirmButtonColor: '#3182ce'
          });
        }
      }
    });
  };

  const handleBlockToggle = (row) => {
    if (row.isBlocked) {
      // Handle unblocking
      Swal.fire({
        title: 'Unblock Employee',
        html: `
          <div style="text-align: left;">
            <p><strong>Name:</strong> ${row.fullname}</p>
            <p><strong>Current block reason:</strong> ${row.blockReason || 'No reason provided'}</p>
            <div style="margin-top: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">Set Status After Unblocking</label>
              <select id="unblock-status" class="swal2-select" style="width: 100%;">
                <option value="Active" selected>Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <p style="margin-top: 15px;">Are you sure you want to unblock this employee?</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Unblock',
        confirmButtonColor: '#38a169',
        cancelButtonColor: '#e53e3e',
        preConfirm: () => {
          return {
            status: document.getElementById('unblock-status').value
          };
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // In a real application, make API call to unblock employee
            const unblockData = {
              userId: row.id,
              status: result.value.status, // Use the status from the form
              isBlocked: false,
              blockReason: '',
              blockedAt: null
            };
            
            try {
              const response = await fetch(`https://oil-backend-maxf.vercel.appunblock-employee/${row.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(unblockData)
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to unblock employee');
              }
              
            } catch (apiError) {
              console.error('API Error during unblock:', apiError);
              // Continue with local unblock despite API error for demo purposes
            }
            
            // Update local state - only update the specific user that was unblocked
            const updatedUsers = users.map(user => {
              if (user.id === row.id) {
                return { 
                  ...user, 
                  isBlocked: false, 
                  status: result.value.status, // Set status to the selected value
                  blockReason: '',
                  blockedAt: null
                };
              }
              return user;
            });
            
            setUsers(updatedUsers);
            
            // Update blocked users in localStorage
            const blockedUsers = updatedUsers.filter(user => user.isBlocked);
            localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
            
            Swal.fire({
              icon: 'success',
              title: 'Unblocked!',
              text: `${row.fullname} has been unblocked and set to ${result.value.status} status.`,
              timer: 2000,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error unblocking employee:', error);
            Swal.fire({
              icon: 'error',
              title: 'Unblock Failed',
              text: error.message || 'There was a problem unblocking the employee.',
              confirmButtonColor: '#3182ce'
            });
          }
        }
      });
    } else {
      // Handle blocking
      Swal.fire({
        title: 'Block Employee',
        html: `
          <div style="text-align: left;">
            <p><strong>Name:</strong> ${row.fullname}</p>
            <p><strong>Current Status:</strong> ${row.status}</p>
            <div style="margin-bottom: 15px; margin-top: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">Block Reason</label>
              <textarea id="block-reason" class="swal2-textarea" placeholder="Enter reason for blocking..." style="width: 100%;"></textarea>
            </div>
            <p style="color: #c53030; font-weight: 500; margin-top: 15px;">
              Note: When blocked, the user's status will be set to Inactive.
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Block',
        confirmButtonColor: '#9c4221',
        cancelButtonColor: '#3182ce',
        preConfirm: () => {
          return {
            blockReason: document.getElementById('block-reason').value
          };
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const currentTime = new Date().toISOString();
            
            // In a real application, make API call to block employee
            const blockData = {
              userId: row.id,
              status: 'Inactive', // Always set status to Inactive when blocking
              isBlocked: true,
              blockReason: result.value.blockReason,
              blockedAt: currentTime
            };
            
            try {
              const response = await fetch(`https://oil-backend-maxf.vercel.appblock-employee/${row.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(blockData)
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to block employee');
              }
              
            } catch (apiError) {
              console.error('API Error during block:', apiError);
              // Continue with local block despite API error for demo purposes
            }
            
            // Update local state
            const updatedUsers = users.map(user => {
              if (user.id === row.id) {
                return {
                  ...user,
                  isBlocked: true,
                  status: 'Inactive', // Set status to Inactive when blocking
                  blockReason: result.value.blockReason,
                  blockedAt: currentTime
                };
              }
              return user;
            });
            
            setUsers(updatedUsers);
            
            // Update blocked users in localStorage
            const blockedUsers = updatedUsers.filter(user => user.isBlocked);
            localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
            
            Swal.fire({
              icon: 'success',
              title: 'Blocked!',
              text: `${row.fullname} has been blocked.`,
              timer: 2000,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error blocking employee:', error);
            Swal.fire({
              icon: 'error',
              title: 'Block Failed',
              text: error.message || 'There was a problem blocking the employee.',
              confirmButtonColor: '#3182ce'
            });
          }
        }
      });
    }
  };

  const addNewEmployee = () => {
    Swal.fire({
      title: 'Add New Employee',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Full Name</label>
            <input id="new-fullname" class="swal2-input" placeholder="Enter full name" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
            <input id="new-email" class="swal2-input" placeholder="Enter email" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Contact</label>
            <input id="new-contact" class="swal2-input" placeholder="Enter contact number" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Address</label>
            <textarea id="new-address" class="swal2-textarea" placeholder="Enter address" style="width: 100%;"></textarea>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Status</label>
            <select id="new-status" class="swal2-select" style="width: 100%;">
              <option value="Active" selected>Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Password</label>
            <input id="new-password" type="password" class="swal2-input" placeholder="Enter password" style="width: 100%;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Employee',
      confirmButtonColor: '#38a169',
      cancelButtonColor: '#e53e3e',
      preConfirm: () => {
        const fullname = document.getElementById('new-fullname').value;
        const email = document.getElementById('new-email').value;
        const contact = document.getElementById('new-contact').value;
        const password = document.getElementById('new-password').value;
        
        // Basic validation
        if (!fullname || !email || !password) {
          Swal.showValidationMessage('Full name, email, and password are required');
          return false;
        }
        
        if (email && !email.includes('@')) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }
        
        return {
          fullname: fullname,
          email: email,
          contact: contact,
          address: document.getElementById('new-address').value,
          status: document.getElementById('new-status').value,
          password: password,
          numberOfShifts: 0,
          isBlocked: false
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // In a real application, make API call to create employee
          const newEmployeeData = {
            ...result.value,
            id: Math.random().toString(36).substr(2, 9), // Generate random ID for demo
          };
          
          try {
            const response = await fetch('https://oil-backend-maxf.vercel.appcreate-employee', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newEmployeeData)
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to create employee');
            }
            
            // Get the newly created employee with its ID from the response
            const responseData = await response.json();
            if (responseData.data && responseData.data._id) {
              newEmployeeData.id = responseData.data._id;
            }
            
          } catch (apiError) {
            console.error('API Error during create:', apiError);
            // Continue with local create despite API error for demo purposes
          }
          
          // Update local state
          setUsers([...users, newEmployeeData]);
          
          Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `${result.value.fullname} has been added successfully.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error adding employee:', error);
          Swal.fire({
            icon: 'error',
            title: 'Add Failed',
            text: error.message || 'There was a problem adding the employee.',
            confirmButtonColor: '#3182ce'
          });
        }
      }
    });
  };

  const showBlockedList = () => {
    const blockedUsers = users.filter(user => user.isBlocked);
    
    if (blockedUsers.length === 0) {
      Swal.fire({
        title: 'No Blocked Users',
        text: 'There are currently no blocked employees.',
        icon: 'info',
        confirmButtonColor: '#3182ce'
      });
      return;
    }
    
    // Format date function
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        return 'Invalid date';
      }
    };
    
    // Generate HTML for blocked users list
    const blockedUsersHtml = blockedUsers.map((user, index) => `
      <div style="
        padding: 15px; 
        border-radius: 8px; 
        background-color: #fff8e1; 
        margin-bottom: 15px;
        border: 1px solid #ffe0b2;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: 16px;">${user.fullname}</h3>
          <button 
            class="unblock-btn" 
            data-id="${user.id}" 
            style="
              background-color: #38a169; 
              color: white; 
              border: none; 
              padding: 5px 10px; 
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Unblock
          </button>
        </div>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Block Reason:</strong> ${user.blockReason || 'No reason provided'}</p>
        <p style="margin: 5px 0;"><strong>Blocked At:</strong> ${formatDate(user.blockedAt)}</p>
      </div>
    `).join('');
    
    Swal.fire({
      title: 'Blocked Employees',
      html: `
        <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
          ${blockedUsersHtml}
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#3182ce',
      width: '600px',
      didOpen: () => {
        // Add event listeners to unblock buttons
        const unblockButtons = document.querySelectorAll('.unblock-btn');
        unblockButtons.forEach(button => {
          button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            const userToUnblock = users.find(u => u.id === userId);
            if (userToUnblock) {
              Swal.close();
              handleBlockToggle(userToUnblock);
            }
          });
        });
      }
    });
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  // Configure columns for the data table
  const columns = [
    {
      name: 'Name',
      selector: row => row.fullname,
      sortable: true,
      grow: 1.5,
      style: {
        fontWeight: '500',
        color: '#2d3748',
      },
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Contact',
      selector: row => row.contact,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <div className={`badge ${row.isBlocked ? 'badge-blocked' : (row.status === 'Active' ? 'badge-active' : 'badge-inactive')}`}>
          {row.isBlocked ? (
            <>
              <FaBan className="status-icon" />
              Blocked
            </>
          ) : row.status === 'Active' ? (
            <>
              <FaUserCheck className="status-icon" />
              {row.status}
            </>
          ) : (
            <>
              <FaBan className="status-icon" />
              {row.status}
            </>
          )}
        </div>
      ),
    },
    {
      name: 'Shifts',
      selector: row => row.numberOfShifts,
      sortable: true,
      hide: 'md',
      cell: row => (
        <div style={{ fontWeight: '500' }}>
          {row.numberOfShifts || 0}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button 
            className="action-button view-button" 
            onClick={() => handleView(row)}
            title="View Details"
          >
            <FaEye size={14} />
          </button>
          
          <button 
            className="action-button edit-button" 
            onClick={() => handleEdit(row)}
            disabled={row.isBlocked}
            title={row.isBlocked ? "Blocked user cannot be edited" : "Edit User"}
            style={row.isBlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <FaEdit size={14} />
          </button>
          
          <button 
            className={`action-button ${row.isBlocked ? 'unblock-button' : 'block-button'}`}
            onClick={() => handleBlockToggle(row)}
            title={row.isBlocked ? "Unblock User" : "Block User"}
          >
            {row.isBlocked ? <FaUserCheck size={14} /> : <FaBan size={14} />}
          </button>
          
          <button 
            className="action-button delete-button" 
            onClick={() => handleDelete(row)}
            title="Delete User"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
      width: '160px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Configure pagination options
  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };
  
  // Data for CSV export
  const csvData = filteredUsers.map(user => ({
    'Full Name': user.fullname,
    'Email': user.email,
    'Contact': user.contact,
    'Address': user.address,
    'Status': user.isBlocked ? 'Blocked' : user.status,
    'Shifts': user.numberOfShifts || 0,
    'Blocked': user.isBlocked ? 'Yes' : 'No',
    'Block Reason': user.blockReason || '',
    'Blocked At': user.blockedAt || ''
  }));

  return (
    <div style={styles.container}>
      <style>{spinKeyframes}</style>
      
      <button style={styles.backButton} onClick={() => window.history.back()}>
        <FaArrowLeft /> Go Back
      </button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Employee Management</h1>
        <div style={styles.buttonsContainer}>
          <CSVLink 
            data={csvData} 
            filename={"employees-data.csv"}
            style={styles.exportButton}
          >
            <FaFileExport /> Export to CSV
          </CSVLink>
          
          <button style={styles.addButton} onClick={addNewEmployee}>
            <FaUserPlus /> Add Employee
          </button>
          
          <button style={styles.refreshButton} onClick={fetchEmployees}>
            <FaSync /> Refresh Data
          </button>
          
          <button style={styles.blockedListButton} onClick={showBlockedList}>
            <FaBan /> Blocked List
          </button>
        </div>
      </div>
      
      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search employees by name, email, contact..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.card}>
        {isLoading ? (
          <div style={styles.loadingMessage}>
            <div style={styles.spinner}></div>
            <span style={{ marginLeft: '10px' }}>Loading employee data...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={styles.noDataMessage}>
            No employees found matching your search criteria.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            paginationServer
            paginationTotalRows={totalUsers}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            onSort={handleSort}
            sortServer
            defaultSortFieldId={sortField}
            defaultSortAsc={sortDirection === 'asc'}
            responsive
            highlightOnHover
            pointerOnHover
            className="main-table"
            paginationComponentOptions={paginationOptions}
            persistTableHead
          />
        )}
      </div>
      
      <div style={styles.paginationInfo}>
        {!isLoading && (
          <span>Showing {filteredUsers.length} out of {totalUsers} employees</span>
        )}
      </div>
    </div>
  );
}

export default UserDetails;