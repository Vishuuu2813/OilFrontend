import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTrash, 
  faHeart,
  faSadTear,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { getWishlistWithDetails, removeFromWishlist } from './wishlistService';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!userData || !userData._id) {
        navigate('/EmployeeLogin');
        return;
      }
      
      const response = await getWishlistWithDetails(userData._id);
      
      if (response.status === "success") {
        setWishlistItems(response.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!userData || !userData._id) {
        navigate('/EmployeeLogin');
        return;
      }
      
      await removeFromWishlist(userData._id, itemId);
      
      // Update state to remove the item
      setWishlistItems(wishlistItems.filter(item => item.itemId !== itemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton} 
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 style={styles.title}>
          <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} /> My Wishlist
        </h1>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} spin style={styles.loadingIcon} />
          <p>Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div style={styles.emptyContainer}>
          <FontAwesomeIcon icon={faSadTear} style={styles.emptyIcon} />
          <p style={styles.emptyText}>Your wishlist is empty</p>
          <Link to="/" style={styles.exploreButton}>
            Explore Departments
          </Link>
        </div>
      ) : (
        <div style={styles.wishlistGrid}>
          {wishlistItems.map((item) => (
            <div key={item.itemId} style={styles.wishlistCard}>
              <button 
                style={styles.removeButton}
                onClick={() => handleRemoveFromWishlist(item.itemId)}
                aria-label="Remove from wishlist"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              
              <Link to={`/department/${item.itemId}`} style={styles.cardLink}>
                <div style={styles.cardImageContainer}>
                  <img 
                    src={item.department?.photo || 'https://via.placeholder.com/150'} 
                    alt={item.department?.name || 'Department Image'} 
                    style={styles.cardImage} 
                  />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {item.department?.name || 'Unknown Department'}
                  </h3>
                  <p style={styles.cardDescription}>
                    {item.department?.address || 'No address available'}
                  </p>
                  {item.department?.amountOfShift && (
                    <p style={styles.cardPrice}>₹{item.department.amountOfShift}</p>
                  )}
                  {item.department?.shiftArea && (
                    <p style={styles.cardLocation}>{item.department.shiftArea}</p>
                  )}
                  <div style={styles.dateAdded}>
                    Added on {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#4a6cf7',
    cursor: 'pointer',
    marginRight: '15px',
  },
  
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
  },
  
  heartIcon: {
    color: '#ff385c',
    marginRight: '10px',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    color: '#6b7280',
    fontSize: '16px',
  },

  loadingIcon: {
    fontSize: '32px',
    color: '#4a6cf7',
    marginBottom: '16px',
  },
  
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    textAlign: 'center',
  },
  
  emptyIcon: {
    fontSize: '50px',
    color: '#9ca3af',
    marginBottom: '20px',
  },
  
  emptyText: {
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '20px',
  },
  
  exploreButton: {
    padding: '10px 20px',
    backgroundColor: '#4a6cf7',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'background-color 0.3s ease',
  },
  
  wishlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  
  wishlistCard: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  removeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 56, 92, 0.9)',
    color: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
  },
  
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  
  cardImageContainer: {
    height: '180px',
    overflow: 'hidden',
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  cardContent: {
    padding: '15px',
  },
  
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
  
  cardDescription: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  
  cardPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a6cf7',
    margin: '0 0 5px 0',
  },
  
  cardLocation: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 5px 0',
  },

  dateAdded: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '10px',
    fontStyle: 'italic',
  }
};

export default Wishlist;