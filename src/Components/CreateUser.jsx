import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSearch, FaFileExport, FaChevronLeft, FaChevronRight, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { CSVLink } from 'react-csv';

function CreateUser() {
  // CSS Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2d3748',
      margin: '0',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#4a5568',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '32px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#2d3748',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    formGroup: {
      marginBottom: '12px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
      color: '#4a5568',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    addressInput: {
      gridColumn: '1 / -1',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      gridColumn: '1 / -1',
    },
    primaryButton: {
      flexGrow: 1,
      backgroundColor: '#3182ce',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color 0.2s ease',
    },
    cancelButton: {
      flexGrow: 1,
      backgroundColor: '#718096',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
    },
    spinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid white',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #e2e8f0',
    },
    tableHeader: {
      backgroundColor: '#f7fafc',
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4a5568',
      cursor: 'pointer',
      border: '1px solid #e2e8f0',
      transition: 'background-color 0.2s ease',
    },
    tableCell: {
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      color: '#2d3748',
    },
    tableRow: {
      transition: 'background-color 0.2s ease',
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      marginRight: '8px',
      transition: 'background-color 0.2s ease',
    },
    editButton: {
      backgroundColor: '#ecc94b',
    },
    deleteButton: {
      backgroundColor: '#e53e3e',
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '16px',
      width: '100%',
    },
    searchInputWrapper: {
      position: 'relative',
      flexGrow: 1,
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
    },
    searchInput: {
      paddingLeft: '36px',
      padding: '10px',
      paddingLeft: '36px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      width: '100%',
      fontSize: '14px',
    },
    exportButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#38a169',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      transition: 'background-color 0.2s ease',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
      gap: '4px',
    },
    paginationButton: {
      padding: '6px 10px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#e2e8f0',
      transition: 'background-color 0.2s ease',
    },
    activePaginationButton: {
      backgroundColor: '#3182ce',
      color: 'white',
    },
    entriesContainer: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
    },
    entriesSelect: {
      margin: '0 8px',
      padding: '6px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
    },
    statusText: {
      fontSize: '14px',
      color: '#718096',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '16px',
      color: '#718096',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '32px',
      color: '#718096',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '16px',
    },
    walletCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '32px',
    },
    walletForm: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-end',
    },
    walletSection: {
      flexGrow: 1,
    },
    walletInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '14px',
    },
    walletButton: {
      backgroundColor: '#38a169',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    walletIcon: {
      color: '#38a169',
      marginRight: '8px',
    },
    walletBalance: {
      fontWeight: 'bold',
      color: '#38a169',
    },
    '@media (min-width: 768px)': {
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  };

  // Keyframes for spinner animation
  const spinKeyframes = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    address: '',
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://oil-backend-maxf.vercel.appemployees');
      if (res.data.status === 'success') {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users',
        confirmButtonColor: '#3182ce',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (isEditing) {
        res = await axios.put(`https://oil-backend-maxf.vercel.appupdate-employee/${editingId}`, form);
      } else {
        res = await axios.post('https://oil-backend-maxf.vercel.appadd-employee', form);
      }
      if (res.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.data.message,
          confirmButtonColor: '#3182ce',
        });
        fetchUsers();
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.data.message,
          confirmButtonColor: '#3182ce',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
        confirmButtonColor: '#3182ce',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      fullname: '',
      email: '',
      contact: '',
      password: '',
      address: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setForm({
      fullname: user.fullname,
      email: user.email,
      contact: user.contact,
      password: user.password,
      address: user.address,
    });
    setIsEditing(true);
    setEditingId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3182ce',
      cancelButtonColor: '#e53e3e',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const res = await axios.delete(`https://oil-backend-maxf.vercel.appdelete-employee/${id}`);
          if (res.data.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.data.message,
              confirmButtonColor: '#3182ce',
            });
            fetchUsers();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.data.message,
              confirmButtonColor: '#3182ce',
            });
          }
        } catch (err) {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong',
            confirmButtonColor: '#3182ce',
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setWalletAmount('');
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a user first',
        confirmButtonColor: '#3182ce',
      });
      return;
    }

    if (!walletAmount || isNaN(walletAmount) || Number(walletAmount) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount',
        confirmButtonColor: '#3182ce',
      });
      return;
    }

    setIsAddingFunds(true);
    try {
      const res = await axios.post('https://oil-backend-maxf.vercel.appadd-wallet-funds', {
        userId: selectedUser._id,
        amount: Number(walletAmount)
      });

      if (res.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Successfully added ${walletAmount} to ${selectedUser.fullname}'s wallet`,
          confirmButtonColor: '#3182ce',
        });
        setWalletAmount('');
        fetchUsers();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.data.message || 'Failed to add funds',
          confirmButtonColor: '#3182ce',
        });
      }
    } catch (err) {
      console.error('Error adding funds:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add funds to wallet',
        confirmButtonColor: '#3182ce',
      });
    } finally {
      setIsAddingFunds(false);
    }
  };

  const handleEntriesChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.contact?.toLowerCase().includes(searchLower) ||
      user.address?.toLowerCase().includes(searchLower)
    );
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);
    
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const csvData = [
    ['Full Name', 'Email', 'Contact', 'Address', 'Wallet Balance', 'Created At', 'Last Login'],
    ...users.map((user) => [
      user.fullname,
      user.email,
      user.contact,
      user.address,
      user.walletBalance || '0',
      user.createdAt,
      user.lastLogin,
    ]),
  ];

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>User Management</h2>
          <button
            onClick={() => window.location.href = '/AdminDashboard'}
            style={styles.backButton}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{isEditing ? 'Edit User' : 'Create New User'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact</label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="text"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={isLoading}
              >
                {isLoading && <span style={styles.spinner}></span>}
                {isEditing ? 'Update User' : 'Create User'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.walletCard}>
          <h3 style={styles.cardTitle}>
            <FaWallet style={{ marginRight: '8px' }} />
            Add Funds to User Wallet
          </h3>
          <form onSubmit={handleAddFunds} style={styles.walletForm}>
            <div style={{ ...styles.walletSection, flex: 2 }}>
              <label style={styles.label}>Select User</label>
              <select 
                value={selectedUser ? selectedUser._id : ''}
                onChange={(e) => {
                  const userId = e.target.value;
                  const user = users.find(u => u._id === userId);
                  handleUserSelect(user);
                }}
                style={styles.input}
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullname} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.walletSection}>
              <label style={styles.label}>Current Balance</label>
              <div style={styles.input}>
                <span style={styles.walletBalance}>
                  {selectedUser ? (selectedUser.walletBalance || '0') : '0'} INR
                </span>
              </div>
            </div>
            <div style={styles.walletSection}>
              <label style={styles.label}>Amount to Add (INR)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                type="submit"
                style={styles.walletButton}
                disabled={isAddingFunds || !selectedUser}
              >
                {isAddingFunds && <span style={styles.spinner}></span>}
                <FaWallet />
                Add Funds
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.topBar}>
            <h3 style={styles.cardTitle}>User List</h3>
            <div style={styles.searchContainer}>
              <div style={styles.searchInputWrapper}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={styles.searchInput}
                />
              </div>
              <CSVLink
                data={csvData}
                filename={'employees.csv'}
                style={styles.exportButton}
              >
                <FaFileExport />
                Export CSV
              </CSVLink>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={styles.entriesContainer}>
              <span>Show</span>
              <select
                value={usersPerPage}
                onChange={handleEntriesChange}
                style={styles.entriesSelect}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
              <span>entries</span>
            </div>
            <div style={styles.statusText}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      ...styles.spinner,
                      borderColor: '#3182ce',
                      borderTopColor: 'transparent',
                      marginRight: '8px',
                    }}
                  ></span>
                  Loading...
                </div>
              ) : (
                <>
                  {sortedUsers.length > 0 ? (
                    `Showing ${indexOfFirstUser + 1} to ${Math.min(
                      indexOfLastUser,
                      sortedUsers.length
                    )} of ${sortedUsers.length} entries`
                  ) : (
                    'No entries to show'
                  )}
                </>
              )}
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('fullname')}
                  >
                    Full Name{' '}
                    {sortConfig.key === 'fullname' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('email')}
                  >
                    Email{' '}
                    {sortConfig.key === 'email' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('contact')}
                  >
                    Contact{' '}
                    {sortConfig.key === 'contact' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th style={styles.tableHeader}>Address</th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('walletBalance')}
                  >
                    Wallet Balance{' '}
                    {sortConfig.key === 'walletBalance' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('createdAt')}
                  >
                    Created At{' '}
                    {sortConfig.key === 'createdAt' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('lastLogin')}
                  >
                    Last Login{' '}
                    {sortConfig.key === 'lastLogin' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        ...styles.tableCell,
                        textAlign: 'center',
                        padding: '32px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span
                          style={{
                            ...styles.spinner,
                            width: '24px',
                            height: '24px',
                            borderWidth: '4px',
                            borderColor: '#3182ce',
                            borderTopColor: 'transparent',
                            marginRight: '12px',
                          }}
                        ></span>
                        Loading data...
                      </div>
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user, idx) => (
                    <tr key={idx} style={styles.tableRow}>
                      <td style={styles.tableCell}>{user.fullname}</td>
                      <td style={styles.tableCell}>{user.email}</td>
                      <td style={styles.tableCell}>{user.contact}</td>
                      <td style={styles.tableCell}>{user.address}</td>
                      <td style={styles.tableCell}>
                        <span style={styles.walletBalance}>
                          {user.walletBalance || '0'} INR
                        </span>
                      </td>
                      <td style={styles.tableCell}>{user.createdAt}</td>
                      <td style={styles.tableCell}>{user.lastLogin}</td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex' }}>
                          <button
                            onClick={() => handleEdit(user)}
                            style={{ ...styles.actionButton, ...styles.editButton }}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleUserSelect(user)}
                            style={{ 
                              ...styles.actionButton, 
                              backgroundColor: '#38a169',
                              width: 'auto',
                              padding: '0 8px'
                            }}
                            title="Add Funds"
                          >
                            <FaWallet style={{ marginRight: '4px' }} />
                            Add Funds
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        ...styles.tableCell,
                        textAlign: 'center',
                        padding: '16px',
                      }}
                    >
                      {users.length === 0 ? 'No users available.' : 'No matching users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {sortedUsers.length > usersPerPage && (
            <div style={styles.paginationContainer}>
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                style={{
                  ...styles.paginationButton,
                  backgroundColor:
                    currentPage === 1 || isLoading ? '#edf2f7' : '#e2e8f0',
                  cursor: currentPage === 1 || isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                <FaChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((num) => num <= 3 || num > totalPages - 3 || Math.abs(num - currentPage) <= 1)
                .map((number, idx, array) => {
                  if (idx > 0 && number - array[idx - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${number}`}>
                        <span style={{ padding: '6px 10px' }}>...</span>
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          disabled={isLoading}
                          style={{
                            ...styles.paginationButton,
                            ...(currentPage === number
                              ? { backgroundColor: '#3182ce', color: 'white' }
                              : {}),
                          }}
                        >
                          {number}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      disabled={isLoading}
                      style={{
                        ...styles.paginationButton,
                        ...(currentPage === number
                          ? { backgroundColor: '#3182ce', color: 'white' }
                          : {}),
                      }}
                    >
                      {number}
                    </button>
                  );
                })}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || isLoading}
                style={{
                  ...styles.paginationButton,
                  backgroundColor:
                    currentPage === totalPages || isLoading ? '#edf2f7' : '#e2e8f0',
                  cursor: currentPage === totalPages || isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateUser;