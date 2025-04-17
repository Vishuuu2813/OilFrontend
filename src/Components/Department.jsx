import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  faSearch,
  faMapMarkerAlt,
  faCalendarPlus,
  faBuilding,
  faFilter,
  faClock,
  faTimes,
  faMapMarkedAlt,
  faHourglassHalf,
  faInfoCircle,
  faArrowRight,
  faHeart as faHeartSolid
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Department() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    shiftHours: "",
    location: "",
    noOfShifts: "",
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // New state for the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // Wishlist states
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [userData, setUserData] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userDataString = localStorage.getItem('userData');
      
      if (token && userDataString) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userDataString));
      }
    };

    checkLoginStatus();
  }, []);

  // Fetch departments and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const departmentsResponse = await axios.get(
          "https://oil-backend-maxf.vercel.appdepartments"
        );

        if (departmentsResponse.data.status === "success") {
          const departmentsData = departmentsResponse.data.data.map((dept) => ({
            id: dept._id,
            name: dept.name,
            category: dept.category,
            location: dept.address,
            image: dept.photo || "/api/placeholder/200/200",
            // New fields
            shiftHours: dept.shiftHours || "",
            noOfShifts: dept.noOfShifts || "",
            shiftStartTime: dept.shiftStartTime || "",
            shiftEndTime: dept.shiftEndTime || "",
            locationEmbed: dept.locationEmbed || "",
            shiftArea: dept.shiftArea || "",
            amountOfShift: dept.amountOfShift || "",
            remainingTime: dept.remainingTime || "",
            maxEnroll: dept.maxEnroll || "",
            // Add permanent slab data
            permanentSlab: dept.permanentSlab || {
              purpose: "",
              numberOfHours: "",
              timer: {
                label: "",
                hours: ""
              }
            }
          }));

          setDepartments(departmentsData);
          setFilteredDepartments(departmentsData);
        }

        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://oil-backend-maxf.vercel.appcategories-with-count"
        );

        if (categoriesResponse.data.status === "success") {
          const categoryNames = [
            "all",
            ...categoriesResponse.data.data.map((cat) => cat.name),
          ];
          setCategories(categoryNames);
        }
        
        // Fetch user's wishlist if logged in
        await fetchWishlist();

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    try {
      if (!isLoggedIn || !userData || !userData._id) return;
      
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await axios.get(`https://oil-backend-maxf.vercel.appget-wishlist/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === "success") {
        setWishlistedItems(response.data.wishlist.map(item => item.itemId));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Handle toggling wishlist items
 // Handle toggling wishlist items
const handleWishlistToggle = async (itemId, event) => {
  event.preventDefault(); // Prevent navigating to department details
  event.stopPropagation(); // Stop event bubbling
  
  if (!isLoggedIn) {
    toast.warning("Please login to add items to wishlist", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    navigate('/employeelogin');
    return;
  }
  
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    // Check if item is already in wishlist
    const isWishlisted = wishlistedItems.includes(itemId);
    
    if (isWishlisted) {
      // Show SweetAlert confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to remove this item from your wishlist?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Remove from wishlist
          await axios.post('https://oil-backend-maxf.vercel.appremove-from-wishlist', 
            { userId: userData._id, itemId },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          setWishlistedItems(wishlistedItems.filter(id => id !== itemId));
          
          // Show success toast
          toast.success('Item removed from wishlist', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      });
    } else {
      // Add to wishlist
      await axios.post('https://oil-backend-maxf.vercel.appadd-to-wishlist', 
        { userId: userData._id, itemId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setWishlistedItems([...wishlistedItems, itemId]);
      
      // Show success toast
      toast.success('Item added to wishlist!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    // Show error toast
    toast.error('Error updating wishlist', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }
};

  // Open details modal
  const openDetailsModal = (department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDepartment(null);
  };

  // Filter departments by category
  const filterCategory = (category) => {
    setActiveCategory(category);
    applyFilters(category, searchQuery, filters);
  };

  // Filter departments by search query
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    applyFilters(activeCategory, query, filters);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(activeCategory, searchQuery, updatedFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      shiftHours: "",
      location: "",
      noOfShifts: "",
    });
    setSearchQuery("");
    setActiveCategory("all");
    setFilteredDepartments(departments);
  };

  // Apply both category and search filters
  const applyFilters = (category, query, filterOptions = filters) => {
    let filtered = departments;

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((dept) => dept.category === category);
    }

    // Apply search filter
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(lowerCaseQuery) ||
          dept.category.toLowerCase().includes(lowerCaseQuery) ||
          dept.location.toLowerCase().includes(lowerCaseQuery) ||
          (dept.shiftArea &&
            dept.shiftArea.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Apply advanced filters
    if (filterOptions.shiftHours) {
      filtered = filtered.filter(
        (dept) =>
          dept.shiftHours &&
          parseInt(dept.shiftHours) <= parseInt(filterOptions.shiftHours)
      );
    }

    if (filterOptions.location) {
      const locationQuery = filterOptions.location.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          (dept.location &&
            dept.location.toLowerCase().includes(locationQuery)) ||
          (dept.shiftArea &&
            dept.shiftArea.toLowerCase().includes(locationQuery))
      );
    }

    if (filterOptions.noOfShifts) {
      filtered = filtered.filter(
        (dept) =>
          dept.noOfShifts &&
          parseInt(dept.noOfShifts) >= parseInt(filterOptions.noOfShifts)
      );
    }

    setFilteredDepartments(filtered);
  };

  // Open location modal
  const openLocationModal = (locationEmbed) => {
    setSelectedLocation(locationEmbed);
    setShowLocationModal(true);
  };

  // Close location modal
  const closeLocationModal = () => {
    setShowLocationModal(false);
    setSelectedLocation("");
  };

  // Format time for display (12-hour format)
  const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  // Handle book shift button click
  const handleBookShift = (departmentId, department) => {
    if (isLoggedIn) {
      navigate(`/Recharge/${departmentId}`, { state: { department } });
    } else {
      navigate('/employeelogin');
    }
  };

  // Component for each department card
  const DepartmentCard = ({ department }) => (
    <div style={styles.departmentCard} data-category={department.category}>
      <div style={styles.cardImageContainer}>
        <img
          src={department.image}
          alt={department.name}
          style={styles.cardImage}
        />
        <div style={styles.categoryBadge}>{department.category}</div>

        {/* Shift Hours Badge */}
        {department.shiftHours && (
          <div style={styles.hoursBadge}>
            <FontAwesomeIcon icon={faClock} style={styles.hoursIcon} />
            {department.shiftHours}h
          </div>
        )}
        
        {/* Wishlist button */}
        <button 
          style={styles.wishlistButton}
          onClick={(e) => handleWishlistToggle(department.id, e)}
          aria-label={wishlistedItems.includes(department.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FontAwesomeIcon 
            icon={wishlistedItems.includes(department.id) ? faHeartSolid : faHeartRegular} 
            style={{
              color: wishlistedItems.includes(department.id) ? '#ff385c' : '#ffffff'
            }} 
          />
        </button>
      </div>
      <div style={styles.departmentContent}>
        <h3 style={styles.departmentTitle}>{department.name}</h3>

        {/* Area and Location */}
        <div style={styles.metaRow}>
          <p style={styles.departmentLocation}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={styles.locationIcon}
            />
            {department.shiftArea || department.location}
          </p>

          {/* Location Map Button - Only show if locationEmbed exists */}
          {department.locationEmbed && (
            <button
              style={styles.mapButton}
              onClick={() => openLocationModal(department.locationEmbed)}
              aria-label="View Location Map"
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} />
            </button>
          )}
        </div>

        {/* Shift Time Info */}
        {department.shiftStartTime && department.shiftEndTime && (
          <div style={styles.timeInfo}>
            <div style={styles.timeLabel}>
              <FontAwesomeIcon icon={faClock} style={styles.timeIcon} /> Shift
              Time:
            </div>
            <div style={styles.timeValue}>
              {formatTime(department.shiftStartTime)} -{" "}
              {formatTime(department.shiftEndTime)}
            </div>
          </div>
        )}

        {/* Remaining Time Counter */}
        {department.remainingTime && (
          <div style={styles.remainingTime}>
            <FontAwesomeIcon icon={faHourglassHalf} style={styles.timeIcon} />
            <span>
              {parseFloat(department.remainingTime) > 0
                ? `Expires in: ${department.remainingTime}h`
                : "Expired"}
            </span>
          </div>
        )}

        {/* Price and Booking Button */}
        <div style={styles.bookingRow}>
          <div style={styles.priceTag}>${department.amountOfShift}</div>
          <button 
            style={styles.resetButton}
            onClick={() => handleBookShift(department.id, department)}
          >
            <FontAwesomeIcon icon={faCalendarPlus} /> Book Shift
          </button>
        </div>
        
        {/* View More Button */}
        <button 
          style={styles.viewMoreButton}
          onClick={() => openDetailsModal(department)}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> View More Details
          <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );

  // Details Modal Component
  const DetailsModal = () => {
    if (!selectedDepartment) return null;
    
    const { permanentSlab } = selectedDepartment;
    
    return (
      <div style={styles.modalOverlay} onClick={closeDetailsModal}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Shift Details: {selectedDepartment.name}</h3>
            <button style={styles.closeButton} onClick={closeDetailsModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div style={styles.modalBody}>
            {permanentSlab && permanentSlab.purpose ? (
              <>
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>Why This Shift Is Important</h4>
                  <p style={styles.purposeText}>{permanentSlab.purpose}</p>
                </div>
                
                {permanentSlab.numberOfHours && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle}>Recommended Hours</h4>
                    <p style={styles.detailText}>
                      <FontAwesomeIcon icon={faClock} style={styles.detailIcon} />
                      {permanentSlab.numberOfHours} hours
                    </p>
                  </div>
                )}
                
                {permanentSlab.timer && permanentSlab.timer.label && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle}>{permanentSlab.timer.label}</h4>
                    <p style={styles.detailText}>
                      <FontAwesomeIcon icon={faHourglassHalf} style={styles.detailIcon} />
                      {permanentSlab.timer.hours} hours
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div style={styles.noDetailsMessage}>
                <FontAwesomeIcon icon={faInfoCircle} size="2x" style={styles.noDetailsIcon} />
                <p>No additional details available for this shift.</p>
              </div>
            )}
            
            <div style={styles.modalActions}>
              <button 
                style={styles.bookNowButton}
                onClick={() => {
                  closeDetailsModal();
                  handleBookShift(selectedDepartment.id, selectedDepartment);
                }}
              >
                <FontAwesomeIcon icon={faCalendarPlus} /> Book This Shift Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading component
  const LoadingState = () => (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading departments...</p>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>{error}</p>
      <button
        style={styles.resetButton}
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  // Location Modal Component
  const LocationModal = () => (
    <div style={styles.modalOverlay} onClick={closeLocationModal}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Location Map</h3>
          <button style={styles.closeButton} onClick={closeLocationModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div style={styles.mapContainer}>
          <div
            dangerouslySetInnerHTML={{ __html: selectedLocation }}
            style={styles.mapEmbed}
          />
        </div>
      </div>
    </div>
  );

  // Filter Panel Component
  const FilterPanel = () => (
    <div style={showFilters ? styles.filterPanel : styles.filterPanelHidden}>
      <div style={styles.filterHeader}>
        <h3 style={styles.filterTitle}>Advanced Filters</h3>
        <button
          style={styles.closeFilterButton}
          onClick={() => setShowFilters(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div style={styles.filterForm}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            Max Shift Hours:
            <input
              type="range"
              name="shiftHours"
              min="1"
              max="18"
              value={filters.shiftHours || "18"}
              onChange={handleFilterChange}
              style={styles.rangeInput}
            />
            <span style={styles.rangeValue}>
              {filters.shiftHours || "18"} hours
            </span>
          </label>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            Location:
            <input
              type="text"
              name="location"
              placeholder="Filter by location or area..."
              value={filters.location}
              onChange={handleFilterChange}
              style={styles.filterInput}
            />
          </label>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            Minimum Number of Shifts:
            <input
              type="number"
              name="noOfShifts"
              placeholder="Minimum number of shifts"
              min="1"
              value={filters.noOfShifts}
              onChange={handleFilterChange}
              style={styles.filterInput}
            />
          </label>
        </div>

        <div style={styles.filterActions}>
          <button style={styles.resetFiltersButton} onClick={resetFilters}>
            Reset All Filters
          </button>
          <button
            style={styles.applyFiltersButton}
            onClick={() => {
              applyFilters(activeCategory, searchQuery, filters);
              setShowFilters(false);
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Department Section Header */}
      <div style={{ ...styles.sectionHeader, ...styles.departmentsHeader }}>
        <h2 style={styles.sectionTitle}>
          <FontAwesomeIcon icon={faBuilding} style={styles.sectionIcon} />{" "}
          Available Departments
        </h2>
        <div style={styles.statsBadge}>
          {filteredDepartments.length} departments found
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={styles.searchFilterContainer}>
        <div style={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search departments by name, category, or location..."
            onChange={handleSearch}
            value={searchQuery}
            disabled={loading || error}
          />
        </div>
        <button
          style={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
          disabled={loading || error}
        >
          <FontAwesomeIcon icon={faFilter} style={styles.filterButtonIcon} />
          Filter
        </button>
      </div>

      {/* Filter Panel (slides in when active) */}
      <FilterPanel />

      {/* Filter Buttons */}
      <div style={styles.filterContainer}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              ...styles.categoryButton,
              backgroundColor:
                activeCategory === category ? "#4a6cf7" : "#f3f4f6",
              color: activeCategory === category ? "#ffffff" : "#4b5563",
            }}
            onClick={() => filterCategory(category)}
            disabled={loading || error}
          >
            {category === "all" ? "All Departments" : category}
          </button>
        ))}
      </div>

      {/* Content States (Loading, Error, or Department Cards) */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : filteredDepartments.length > 0 ? (
        <div style={styles.departmentGrid}>
          {filteredDepartments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      ) : (
        <div style={styles.noResults}>
          <FontAwesomeIcon
            icon={faSearch}
            size="3x"
            style={styles.noResultsIcon}
          />
          <h3 style={styles.noResultsTitle}>No departments found</h3>
          <p style={styles.noResultsText}>
            No departments match your search criteria. Try adjusting your
            filters.
          </p>
          <button style={styles.resetButton} onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Location Modal (conditionally rendered) */}
      {showLocationModal && <LocationModal />}
      
      {/* Details Modal (conditionally rendered) */}
      {showDetailsModal && <DetailsModal />}
    </>
  );
}

// Styles object
const styles = {
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    padding: "1rem 0",
  },
  departmentsHeader: {
    borderBottom: "1px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: "0.5rem",
    color: "#4a6cf7",
  },
  statsBadge: {
    background: "#e0e7ff",
    color: "#4338ca",
    padding: "0.35rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  searchFilterContainer: {
    display: "flex",
    marginBottom: "1.5rem",
    gap: "0.75rem",
  },
  searchContainer: {
    position: "relative",
    flexGrow: 1,
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    color: "#1f2937",
    outline: "none",
    transition: "border-color 0.2s",
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterButtonIcon: {
    marginRight: "0.5rem",
  },
  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  categoryButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  departmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  departmentCard: {
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: "#ffffff",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardImageContainer: {
    position: "relative",
    height: "180px",
    backgroundColor: "#f3f4f6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#ffffff",
    padding: "0.25rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  hoursBadge: {
    position: "absolute",
    top: "1rem",
    right: "3.5rem", // Adjusted to make room for wishlist button
    backgroundColor: "#4a6cf7",
    color: "#ffffff",
    padding: "0.25rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
  },
  hoursIcon: {
    marginRight: "0.25rem",
  },
  // Wishlist button styles
  wishlistButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    zIndex: 2,
  },
  departmentContent: {
    padding: "1.25rem",
  },
  departmentTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 0,
    marginBottom: "0.75rem",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
  },
  departmentLocation: {
    display: "flex",
    alignItems: "center",
    color: "#4b5563",
    fontSize: "0.875rem",
    margin: 0,
  },
  locationIcon: {
    marginRight: "0.5rem",
    color: "#4a6cf7",
  },
  mapButton: {
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
    border: "none",
    borderRadius: "50%",
    width: "2rem",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  timeInfo: {
    display: "flex",
    alignItems: "center",
    margin: "0.75rem 0",
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  timeLabel: {
    display: "flex",
    alignItems: "center",
    marginRight: "0.5rem",
    fontWeight: "500",
  },
  timeIcon: {
    marginRight: "0.25rem",
    color: "#4a6cf7",
  },
  timeValue: {
    color: "#1f2937",
  },
  remainingTime: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.75rem",
    padding: "0.5rem 0.75rem",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  bookingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    padding: "0.5rem 0",
    borderTop: "1px dashed #e5e7eb",
    borderBottom: "1px dashed #e5e7eb",
  },
  priceTag: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#047857",
  },
  resetButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4a6cf7",
    color: "#ffffff",
    borderRadius: "0.5rem",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  viewMoreButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f9fafb",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  arrowIcon: {
    marginLeft: "0.25rem",
    fontSize: "0.75rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 0",
  },
  loadingSpinner: {
    width: "2.5rem",
    height: "2.5rem",
    border: "4px solid rgba(74, 108, 247, 0.2)",
    borderRadius: "50%",
    borderTop: "4px solid #4a6cf7",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#4b5563",
    fontSize: "1rem",
    fontWeight: "500",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 0",
  },
  errorText: {
    marginBottom: "1rem",
    color: "#b91c1c",
    fontSize: "1rem",
    textAlign: "center",
  },
  noResults: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 0",
    textAlign: "center",
  },
  noResultsIcon: {
    color: "#9ca3af",
    marginBottom: "1rem",
  },
  noResultsTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  noResultsText: {
    color: "#4b5563",
    marginBottom: "1.5rem",
    maxWidth: "80%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#6b7280",
    fontSize: "1.25rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    transition: "all 0.2s",
  },
  mapContainer: {
    width: "100%",
    height: "400px",
    maxHeight: "60vh",
  },
  mapEmbed: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  filterPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    maxWidth: "400px",
    height: "100vh",
    backgroundColor: "#ffffff",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
    padding: "1.5rem",
    transform: "translateX(0)",
    transition: "transform 0.3s ease-in-out",
    overflowY: "auto",
  },
  filterPanelHidden: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    maxWidth: "400px",
    height: "100vh",
    backgroundColor: "#ffffff",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
    padding: "1.5rem",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    overflowY: "auto",
  },
  filterHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
  },
  filterTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  closeFilterButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#6b7280",
    fontSize: "1.25rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    transition: "all 0.2s",
  },
  filterForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  filterLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  rangeInput: {
    width: "100%",
    cursor: "pointer",
  },
  rangeValue: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#4a6cf7",
  },
  filterInput: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb",
    fontSize: "0.875rem",
    color: "#1f2937",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  },
  filterActions: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  resetFiltersButton: {
    flex: 1,
    padding: "0.75rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  applyFiltersButton: {
    flex: 1,
    padding: "0.75rem 1rem",
    backgroundColor: "#4a6cf7",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  // Details modal styles
  modalBody: {
    padding: "1.5rem",
    maxHeight: "calc(90vh - 4rem)",
    overflowY: "auto",
  },
  detailSection: {
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
  },
  detailSectionTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 0,
    marginBottom: "0.75rem",
  },
  purposeText: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#4b5563",
    margin: "0.5rem 0",
  },
  detailText: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1rem",
    color: "#4b5563",
  },
  detailIcon: {
    color: "#4a6cf7",
  },
  modalActions: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
  },
  bookNowButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#047857",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  noDetailsMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 0",
    textAlign: "center",
    color: "#6b7280",
  },
  noDetailsIcon: {
    marginBottom: "1rem",
    color: "#9ca3af",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default Department;