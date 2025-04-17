import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSearch, FaFileExport, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { CSVLink } from 'react-csv';

function CreateDepartmentMember() {
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
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
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

  // Form state
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    contact: '',
    department: '',
    password: '',
    joiningDate: '',
    status: 'active',
    canEditDetails: 'yes',
  });

  // State variables
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch department members and departments on component mount
  useEffect(() => {
    fetchMembers();
    fetchDepartments();
  }, []);

  // Fetch department members
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://oil-backend-maxf.vercel.appdepartment-members');
      if (res.data.status === 'success') {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching department members:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch department members',
        confirmButtonColor: '#3182ce',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments for dropdown
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('https://oil-backend-maxf.vercel.appdepartments');
      if (res.data.status === 'success') {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch departments',
        confirmButtonColor: '#3182ce',
      });
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (isEditing) {
        res = await axios.put(`https://oil-backend-maxf.vercel.appupdate-department-member/${editingId}`, form);
      } else {
        res = await axios.post('https://oil-backend-maxf.vercel.appadd-department-member', form);
      }
      if (res.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.data.message,
          confirmButtonColor: '#3182ce',
        });
        fetchMembers();
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

  // Reset form after submission or cancel
  const resetForm = () => {
    setForm({
      fullname: '',
      email: '',
      contact: '',
      department: '',
      password: '',
      joiningDate: '',
      status: 'active',
      canEditDetails: 'yes',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Handle edit action
  const handleEdit = (member) => {
    setForm({
      fullname: member.fullname,
      email: member.email,
      contact: member.contact,
      department: member.department,
      password: '',  // Don't populate password for security
      joiningDate: member.joiningDate ? member.joiningDate.substring(0, 10) : '',
      status: member.status || 'active',
      canEditDetails: member.canEditDetails || 'yes',
    });
    setIsEditing(true);
    setEditingId(member._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete action
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
          const res = await axios.delete(`https://oil-backend-maxf.vercel.appdelete-department-member/${id}`);
          if (res.data.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.data.message,
              confirmButtonColor: '#3182ce',
            });
            fetchMembers();
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

  // Handle entries per page change
  const handleEntriesChange = (e) => {
    setMembersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter members based on search term
  const filteredMembers = members.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.fullname?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.contact?.toLowerCase().includes(searchLower) ||
      member.department?.toLowerCase().includes(searchLower)
    );
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Sort members based on sort config
  const sortedMembers = React.useMemo(() => {
    let sortableMembers = [...filteredMembers];
    if (sortConfig.key !== null) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMembers;
  }, [filteredMembers, sortConfig]);
    
  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(sortedMembers.length / membersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CSV export data
  const csvData = [
    ['Full Name', 'Email', 'Contact', 'Department', 'Joining Date', 'Status', 'Can Edit Details'],
    ...members.map((member) => [
      member.fullname,
      member.email,
      member.contact,
      member.department,
      member.joiningDate,
      member.status,
      member.canEditDetails,
    ]),
  ];

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Department Member Management</h2>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={styles.backButton}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{isEditing ? 'Edit Department Member' : 'Add New Department Member'}</h3>
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
              <label style={styles.label}>Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required={!isEditing}
                placeholder={isEditing ? "Leave blank to keep current password" : ""}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Joining Date</label>
              <input
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Can Edit Details</label>
              <select
                name="canEditDetails"
                value={form.canEditDetails}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={isLoading}
              >
                {isLoading && <span style={styles.spinner}></span>}
                {isEditing ? 'Update Member' : 'Add Member'}
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
        <div style={styles.card}>
          <div style={styles.topBar}>
            <h3 style={styles.cardTitle}>Department Members List</h3>
            <div style={styles.searchContainer}>
              <div style={styles.searchInputWrapper}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search members..."
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
                filename={'department-members.csv'}
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
                value={membersPerPage}
                onChange={handleEntriesChange}
                style={styles.entriesSelect}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
                  {sortedMembers.length > 0 ? (
                    `Showing ${indexOfFirstMember + 1} to ${Math.min(
                      indexOfLastMember,
                      sortedMembers.length
                    )} of ${sortedMembers.length} entries`
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
                    onClick={() => requestSort('department')}
                  >
                    Department{' '}
                    {sortConfig.key === 'department' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('joiningDate')}
                  >
                    Joining Date{' '}
                    {sortConfig.key === 'joiningDate' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('status')}
                  >
                    Status{' '}
                    {sortConfig.key === 'status' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => requestSort('canEditDetails')}
                  >
                    Can Edit{' '}
                    {sortConfig.key === 'canEditDetails' && (
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
                      colSpan="7"
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
                ) : currentMembers.length > 0 ? (
                  currentMembers.map((member, idx) => (
                    <tr key={idx} style={styles.tableRow}>
                      <td style={styles.tableCell}>{member.fullname}</td>
                      <td style={styles.tableCell}>{member.email}</td>
                      <td style={styles.tableCell}>{member.department}</td>
                      <td style={styles.tableCell}>
                        {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor:
                              member.status === 'active'
                                ? '#C6F6D5' // Green background for active
                                : member.status === 'inactive'
                                ? '#FED7D7' // Red background for inactive
                                : '#FEEBC8', // Yellow background for on-leave
                            color:
                              member.status === 'active'
                                ? '#22543D' // Dark green text for active
                                : member.status === 'inactive'
                                ? '#742A2A' // Dark red text for inactive
                                : '#744210', // Dark yellow text for on-leave
                          }}
                        >
                          {member.status || 'active'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor:
                              member.canEditDetails === 'yes'
                                ? '#C6F6D5' // Green background for yes
                                : '#FED7D7', // Red background for no
                            color:
                              member.canEditDetails === 'yes'
                                ? '#22543D' // Dark green text for yes
                                : '#742A2A', // Dark red text for no
                          }}
                        >
                          {member.canEditDetails || 'yes'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex' }}>
                          <button
                            onClick={() => handleEdit(member)}
                            style={{ ...styles.actionButton, ...styles.editButton }}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        ...styles.tableCell,
                        textAlign: 'center',
                        padding: '16px',
                      }}
                    >
                      {members.length === 0 ? 'No department members available.' : 'No matching members found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {sortedMembers.length > membersPerPage && (
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

export default CreateDepartmentMember;