// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHistory,
//   faMapMarkerAlt,
//   faClock,
//   faTrash,
//   faCalendarTimes,
//   faExclamationTriangle,
//   faFilter,
//   faSearch,
//   faRedo,
//   faBuilding,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";

// function ExpiredShifts() {
//   const [expiredShifts, setExpiredShifts] = useState([]);
//   const [filteredShifts, setFilteredShifts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState(["all"]);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteShiftId, setDeleteShiftId] = useState(null);
//   const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
//   const [dateFilter, setDateFilter] = useState({
//     startDate: "",
//     endDate: "",
//   });

//   // Fetch expired shifts from API
//   useEffect(() => {
//     const fetchExpiredShifts = async () => {
//       try {
//         setLoading(true);
        
//         // Trigger the handler first to ensure all expired shifts are moved to archive
//         await axios.get("http://localhost:8000/handle-expired-shifts");
        
//         // Then fetch the archive
//         const response = await axios.get("http://localhost:8000/expired-shifts-archive");
        
//         if (response.data.status === "success") {
//           const shiftsData = response.data.data || [];
//           setExpiredShifts(shiftsData);
//           setFilteredShifts(shiftsData);
          
//           // Extract unique categories
//           const uniqueCategories = [
//             "all",
//             ...new Set(shiftsData.map((shift) => shift.category).filter(Boolean)),
//           ];
//           setCategories(uniqueCategories);
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching expired shifts:", err);
//         setError("Failed to fetch expired shifts. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchExpiredShifts();
//   }, []);

//   // Apply filters when search query, category, or date filter changes
//   useEffect(() => {
//     applyFilters();
//   }, [searchQuery, selectedCategory, dateFilter, expiredShifts]);

//   // Apply all filters
//   const applyFilters = () => {
//     let filtered = [...expiredShifts];

//     // Apply category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (shift) => shift.category === selectedCategory
//       );
//     }

//     // Apply search filter
//     if (searchQuery) {
//       const lowerCaseQuery = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (shift) =>
//           (shift.name && shift.name.toLowerCase().includes(lowerCaseQuery)) ||
//           (shift.category && shift.category.toLowerCase().includes(lowerCaseQuery)) ||
//           (shift.address && shift.address.toLowerCase().includes(lowerCaseQuery)) ||
//           (shift.shiftArea && shift.shiftArea.toLowerCase().includes(lowerCaseQuery))
//       );
//     }

//     // Apply date filters
//     if (dateFilter.startDate) {
//       const startDate = new Date(dateFilter.startDate);
//       filtered = filtered.filter(
//         (shift) => new Date(shift.expiredAt) >= startDate
//       );
//     }

//     if (dateFilter.endDate) {
//       const endDate = new Date(dateFilter.endDate);
//       endDate.setHours(23, 59, 59, 999); // Set to end of day
//       filtered = filtered.filter(
//         (shift) => new Date(shift.expiredAt) <= endDate
//       );
//     }

//     setFilteredShifts(filtered);
//   };

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Handle category filter change
//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (e) => {
//     const { name, value } = e.target;
//     setDateFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("all");
//     setDateFilter({ startDate: "", endDate: "" });
//     setFilteredShifts(expiredShifts);
//   };

//   // Delete a single expired shift
//   const deleteExpiredShift = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:8000/expired-shifts/${id}`);
      
//       if (response.data.status === "success") {
//         // Remove the deleted shift from state
//         const updatedShifts = expiredShifts.filter((shift) => shift._id !== id);
//         setExpiredShifts(updatedShifts);
//         setFilteredShifts(
//           filteredShifts.filter((shift) => shift._id !== id)
//         );
//       }
      
//       setShowDeleteConfirm(false);
//       setDeleteShiftId(null);
//     } catch (err) {
//       console.error("Error deleting expired shift:", err);
//       setError("Failed to delete shift. Please try again.");
//     }
//   };

//   // Clear all expired shifts
//   const clearAllExpiredShifts = async () => {
//     try {
//       const response = await axios.delete("http://localhost:8000/expired-shifts");
      
//       if (response.data.status === "success") {
//         setExpiredShifts([]);
//         setFilteredShifts([]);
//       }
      
//       setShowClearAllConfirm(false);
//     } catch (err) {
//       console.error("Error clearing expired shifts:", err);
//       setError("Failed to clear all shifts. Please try again.");
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Format time for display
//   const formatTime = (timeString) => {
//     if (!timeString) return "N/A";
    
//     try {
//       const [hours, minutes] = timeString.split(":");
//       const hour = parseInt(hours);
//       const ampm = hour >= 12 ? "PM" : "AM";
//       const hour12 = hour % 12 || 12;
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch (e) {
//       return timeString;
//     }
//   };

//   // Delete confirmation modal
//   const DeleteConfirmModal = () => (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modalContent}>
//         <div style={styles.modalHeader}>
//           <h3 style={styles.modalTitle}>
//             <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#f97316", marginRight: "8px" }} />
//             Confirm Deletion
//           </h3>
//           <button 
//             style={styles.closeButton} 
//             onClick={() => {
//               setShowDeleteConfirm(false);
//               setDeleteShiftId(null);
//             }}
//           >
//             <FontAwesomeIcon icon={faTimes} />
//           </button>
//         </div>
//         <div style={styles.modalBody}>
//           <p>Are you sure you want to delete this expired shift record? This action cannot be undone.</p>
//         </div>
//         <div style={styles.modalFooter}>
//           <button 
//             style={styles.cancelButton} 
//             onClick={() => {
//               setShowDeleteConfirm(false);
//               setDeleteShiftId(null);
//             }}
//           >
//             Cancel
//           </button>
//           <button 
//             style={styles.confirmButton} 
//             onClick={() => deleteExpiredShift(deleteShiftId)}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Clear all confirmation modal
//   const ClearAllConfirmModal = () => (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modalContent}>
//         <div style={styles.modalHeader}>
//           <h3 style={styles.modalTitle}>
//             <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#f97316", marginRight: "8px" }} />
//             Clear All Records
//           </h3>
//           <button 
//             style={styles.closeButton} 
//             onClick={() => setShowClearAllConfirm(false)}
//           >
//             <FontAwesomeIcon icon={faTimes} />
//           </button>
//         </div>
//         <div style={styles.modalBody}>
//           <p style={styles.warningText}>
//             WARNING: You are about to delete ALL expired shift records ({expiredShifts.length} shifts).
//           </p>
//           <p>This action cannot be undone. Are you sure you want to proceed?</p>
//         </div>
//         <div style={styles.modalFooter}>
//           <button 
//             style={styles.cancelButton} 
//             onClick={() => setShowClearAllConfirm(false)}
//           >
//             Cancel
//           </button>
//           <button 
//             style={styles.confirmButton} 
//             onClick={clearAllExpiredShifts}
//           >
//             Clear All
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={styles.container}>
//       {/* Header section */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>
//           <FontAwesomeIcon icon={faHistory} style={styles.titleIcon} />
//           Expired Shifts Archive
//         </h1>
//         <div style={styles.actionButtons}>
//           <button 
//             style={styles.refreshButton}
//             onClick={async () => {
//               setLoading(true);
//               try {
//                 await axios.get("http://localhost:8000/handle-expired-shifts");
//                 const response = await axios.get("http://localhost:8000/expired-shifts-archive");
//                 if (response.data.status === "success") {
//                   setExpiredShifts(response.data.data || []);
//                   setFilteredShifts(response.data.data || []);
//                 }
//               } catch (error) {
//                 console.error("Error refreshing data:", error);
//                 setError("Failed to refresh data");
//               }
//               setLoading(false);
//             }}
//           >
//             <FontAwesomeIcon icon={faRedo} /> Refresh
//           </button>
//           {expiredShifts.length > 0 && (
//             <button 
//               style={styles.clearAllButton}
//               onClick={() => setShowClearAllConfirm(true)}
//             >
//               <FontAwesomeIcon icon={faTrash} /> Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Stats panel */}
//       <div style={styles.statsPanel}>
//         <div style={styles.statCard}>
//           <div style={styles.statValue}>{expiredShifts.length}</div>
//           <div style={styles.statLabel}>Total Expired Shifts</div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statValue}>
//             {categories.length > 1 ? categories.length - 1 : 0}
//           </div>
//           <div style={styles.statLabel}>Departments</div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statValue}>
//             {expiredShifts.length > 0 
//               ? new Date(
//                   Math.max(...expiredShifts.map(s => new Date(s.expiredAt)))
//                 ).toLocaleDateString() 
//               : "N/A"}
//           </div>
//           <div style={styles.statLabel}>Last Expiry Date</div>
//         </div>
//       </div>

//       {/* Filters section */}
//       <div style={styles.filtersSection}>
//         <div style={styles.searchContainer}>
//           <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
//           <input 
//             type="text" 
//             placeholder="Search by name, category or location..." 
//             style={styles.searchInput}
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>

//         <div style={styles.filterGroup}>
//           <div style={styles.filterLabel}>
//             <FontAwesomeIcon icon={faFilter} style={{ marginRight: "8px" }} />
//             Filters:
//           </div>
//           <div style={styles.dateFilters}>
//             <input 
//               type="date" 
//               name="startDate"
//               value={dateFilter.startDate}
//               onChange={handleDateFilterChange}
//               style={styles.dateInput}
//               placeholder="Start Date"
//             />
//             <span style={styles.dateRangeSeparator}>to</span>
//             <input 
//               type="date" 
//               name="endDate"
//               value={dateFilter.endDate}
//               onChange={handleDateFilterChange}
//               style={styles.dateInput}
//               placeholder="End Date"
//             />
//           </div>

//           <div style={styles.categoryFilters}>
//             {categories.map(category => (
//               <button 
//                 key={category} 
//                 style={{
//                   ...styles.categoryButton,
//                   backgroundColor: selectedCategory === category ? "#4a6cf7" : "#f3f4f6",
//                   color: selectedCategory === category ? "#ffffff" : "#4b5563",
//                 }}
//                 onClick={() => handleCategoryChange(category)}
//               >
//                 {category === 'all' ? 'All Categories' : category}
//               </button>
//             ))}
//           </div>

//           {(selectedCategory !== "all" || searchQuery || dateFilter.startDate || dateFilter.endDate) && (
//             <button 
//               style={styles.resetFiltersButton}
//               onClick={resetFilters}
//             >
//               <FontAwesomeIcon icon={faTimes} /> Reset Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Results section */}
//       {loading ? (
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <p>Loading expired shifts...</p>
//         </div>
//       ) : error ? (
//         <div style={styles.errorContainer}>
//           <FontAwesomeIcon icon={faExclamationTriangle} size="2x" style={{ color: "#f87171", marginBottom: "16px" }} />
//           <p style={styles.errorMessage}>{error}</p>
//           <button 
//             style={styles.retryButton}
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       ) : filteredShifts.length === 0 ? (
//         <div style={styles.emptyContainer}>
//           <FontAwesomeIcon icon={faCalendarTimes} size="3x" style={{ color: "#9ca3af", marginBottom: "16px" }} />
//           <h3 style={styles.emptyTitle}>No expired shifts found</h3>
//           <p style={styles.emptyMessage}>
//             {expiredShifts.length > 0 
//               ? "Try adjusting your filters to see more results." 
//               : "There are no expired shifts in the archive."}
//           </p>
//         </div>
//       ) : (
//         <div style={styles.shiftsGrid}>
//           {filteredShifts.map(shift => (
//             <div key={shift._id} style={styles.shiftCard}>
//               <div style={styles.shiftHeader}>
//                 <div style={styles.shiftCategory}>{shift.category}</div>
//                 <button 
//                   style={styles.deleteButton}
//                   onClick={() => {
//                     setDeleteShiftId(shift._id);
//                     setShowDeleteConfirm(true);
//                   }}
//                   aria-label="Delete shift"
//                 >
//                   <FontAwesomeIcon icon={faTrash} />
//                 </button>
//               </div>
              
//               <h3 style={styles.shiftName}>
//                 <FontAwesomeIcon icon={faBuilding} style={styles.shiftNameIcon} />
//                 {shift.name}
//               </h3>
              
//               <div style={styles.shiftInfo}>
//                 <div style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.infoIcon} />
//                   <span>{shift.shiftArea || shift.address || "No location data"}</span>
//                 </div>
                
//                 {shift.shiftStartTime && shift.shiftEndTime && (
//                   <div style={styles.infoRow}>
//                     <FontAwesomeIcon icon={faClock} style={styles.infoIcon} />
//                     <span>
//                       {formatTime(shift.shiftStartTime)} - {formatTime(shift.shiftEndTime)}
//                     </span>
//                   </div>
//                 )}
                
//                 <div style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faHistory} style={styles.infoIcon} />
//                   <span>
//                     Expired: {formatDate(shift.expiredAt || shift.createdAt)}
//                   </span>
//                 </div>
//               </div>
              
//               <div style={styles.shiftFooter}>
//                 <div style={styles.shiftAmount}>
//                   ${shift.amountOfShift || "N/A"}
//                 </div>
//                 {shift.shiftHours && (
//                   <div style={styles.shiftHours}>
//                     <FontAwesomeIcon icon={faClock} style={{ marginRight: "4px" }} />
//                     {shift.shiftHours}h
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       {showDeleteConfirm && <DeleteConfirmModal />}
//       {showClearAllConfirm && <ClearAllConfirmModal />}
//     </div>
//   );
// }

// // Styles for ExpiredShifts component
// const styles = {
//   container: {
//     padding: "24px",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "24px",
//   },
//   title: {
//     fontSize: "1.75rem",
//     fontWeight: "bold",
//     color: "#1f2937",
//     display: "flex",
//     alignItems: "center",
//     margin: 0,
//   },
//   titleIcon: {
//     marginRight: "12px",
//     color: "#4a6cf7",
//   },
//   actionButtons: {
//     display: "flex",
//     gap: "12px",
//   },
//   refreshButton: {
//     display: "flex",
//     alignItems: "center",
//     padding: "8px 16px",
//     backgroundColor: "#4a6cf7",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontWeight: "500",
//     cursor: "pointer",
//   },
//   clearAllButton: {
//     display: "flex",
//     alignItems: "center",
//     padding: "8px 16px",
//     backgroundColor: "#ef4444",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontWeight: "500",
//     cursor: "pointer",
//   },
  
//   // Stats panel
//   statsPanel: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "24px",
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "white",
//     padding: "16px",
//     borderRadius: "8px",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//     textAlign: "center",
//   },
//   statValue: {
//     fontSize: "1.5rem",
//     fontWeight: "bold",
//     color: "#4a6cf7",
//     marginBottom: "8px",
//   },
//   statLabel: {
//     fontSize: "0.875rem",
//     color: "#6b7280",
//   },
  
//   // Filters
//   filtersSection: {
//     marginBottom: "24px",
//   },
//   searchContainer: {
//     position: "relative",
//     marginBottom: "16px",
//   },
//   searchIcon: {
//     position: "absolute",
//     left: "12px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     color: "#9ca3af",
//   },
//   searchInput: {
//     width: "100%",
//     padding: "10px 12px 10px 36px",
//     fontSize: "1rem",
//     borderRadius: "6px",
//     border: "1px solid #e5e7eb",
//     boxSizing: "border-box",
//   },
//   filterGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   filterLabel: {
//     display: "flex",
//     alignItems: "center",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     color: "#4b5563",
//   },
//   dateFilters: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   },
//   dateInput: {
//     padding: "8px 12px",
//     borderRadius: "6px",
//     border: "1px solid #e5e7eb",
//     fontSize: "0.875rem",
//   },
//   dateRangeSeparator: {
//     color: "#6b7280",
//   },
//   categoryFilters: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "8px",
//   },
//   categoryButton: {
//     padding: "6px 12px",
//     borderRadius: "20px",
//     border: "none",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//   },
//   resetFiltersButton: {
//     alignSelf: "flex-start",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     padding: "6px 12px",
//     backgroundColor: "#f3f4f6",
//     color: "#4b5563",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "0.875rem",
//     cursor: "pointer",
//   },
  
//   // Shifts grid
//   shiftsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: "16px",
//   },
//   shiftCard: {
//     backgroundColor: "white",
//     borderRadius: "8px",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//     overflow: "hidden",
//   },
//   shiftHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "12px 16px",
//     borderBottom: "1px solid #f3f4f6",
//   },
//   shiftCategory: {
//     backgroundColor: "#e0e7ff",
//     color: "#4338ca",
//     padding: "4px 8px",
//     borderRadius: "4px",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//   },
//   deleteButton: {
//     backgroundColor: "transparent",
//     color: "#ef4444",
//     border: "none",
//     cursor: "pointer",
//     padding: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "4px",
//   },
//   shiftName: {
//     margin: "16px 16px 12px 16px",
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1f2937",
//     display: "flex",
//     alignItems: "center",
//   },
//   shiftNameIcon: {
//     marginRight: "8px",
//     color: "#4a6cf7",
//   },
//   shiftInfo: {
//     padding: "0 16px 16px 16px",
//   },
//   infoRow: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "8px",
//     fontSize: "0.875rem",
//     color: "#6b7280",
//   },
//   infoIcon: {
//     marginRight: "8px",
//     width: "16px",
//   },
//   shiftFooter: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "12px 16px",
//     backgroundColor: "#f9fafb",
//     borderTop: "1px solid #f3f4f6",
//   },
//   shiftAmount: {
//     fontWeight: "600",
//     color: "#059669",
//     fontSize: "1.125rem",
//   },
//   shiftHours: {
//     display: "flex",
//     alignItems: "center",
//     fontSize: "0.875rem",
//     color: "#4b5563",
//     backgroundColor: "#e5e7eb",
//     padding: "4px 8px",
//     borderRadius: "4px",
//   },
  
//   // Empty state
//   emptyContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "48px 0",
//     textAlign: "center",
//   },
//   emptyTitle: {
//     margin: "0 0 8px 0",
//     fontSize: "1.25rem",
//     fontWeight: "600",
//     color: "#1f2937",
//   },
//   emptyMessage: {
//     color: "#6b7280",
//     maxWidth: "400px",
//   },
  
//   // Loading state
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "48px 0",
//   },
//   spinner: {
//     width: "40px",
//     height: "40px",
//     border: "4px solid #f3f4f6",
//     borderRadius: "50%",
//     borderTop: "4px solid #4a6cf7",
//     animation: "spin 1s linear infinite",
//     marginBottom: "16px",
//   },
  
//   // Error state
//   errorContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "48px 0",
//     textAlign: "center",
//   },
//   errorMessage: {
//     margin: "0 0 16px 0",
//     color: "#ef4444",
//   },
//   retryButton: {
//     padding: "8px 16px",
//     backgroundColor: "#4a6cf7",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontWeight: "500",
//     cursor: "pointer",
//   },
  
//   // Modal styles
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: "8px",
//     width: "100%",
//     maxWidth: "500px",
//     boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//   },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "16px",
//     borderBottom: "1px solid #e5e7eb",
//   },
//   modalTitle: {
//     margin: 0,
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1f2937",
//     display: "flex",
//     alignItems: "center",
//   },
//   closeButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     color: "#6b7280",
//     width: "32px",
//     height: "32px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "4px",
//   },
//   modalBody: {
//     padding: "16px",
//     fontSize: "0.875rem",
//     color: "#4b5563",
//   },
//   warningText: {
//     color: "#ef4444",
//     fontWeight: "600",
//     marginBottom: "8px",
//   },
//   modalFooter: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "12px",
//     padding: "16px",
//     borderTop: "1px solid #e5e7eb",
//   },
//   cancelButton: {
//     padding: "8px 16px",
//     backgroundColor: "#f3f4f6",
//     color: "#4b5563",
//     border: "none",
//     borderRadius: "6px",
//     fontWeight: "500",
//     cursor: "pointer",
//   },
//   confirmButton: {
//     padding: "8px 16px",
//     backgroundColor: "#ef4444",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontWeight: "500",
//     cursor: "pointer",
//   },
// };

// export default ExpiredShifts;