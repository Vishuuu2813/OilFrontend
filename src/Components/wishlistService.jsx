import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8000';

// Add an item to wishlist
export const addToWishlist = async (userId, itemId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/add-to-wishlist`, 
      { userId, itemId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    // Show success toast notification
    toast.success('Item added to wishlist!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    return response.data;
  } catch (error) {
    // Show error toast notification
    toast.error('Failed to add item to wishlist', {
      position: 'top-right',
      autoClose: 3000
    });
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove an item from wishlist
export const removeFromWishlist = async (userId, itemId) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to remove this item from your wishlist?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!'
  });
  
  // Proceed with removal if confirmed
  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/remove-from-wishlist`, 
        { userId, itemId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Show success toast notification
      toast.success('Item removed from wishlist', {
        position: 'top-right',
        autoClose: 3000
      });
      
      return response.data;
    } catch (error) {
      // Show error toast notification
      toast.error('Failed to remove item from wishlist', {
        position: 'top-right',
        autoClose: 3000
      });
      
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  } else {
    // User canceled, return null or some indication that nothing happened
    return null;
  }
};

// Get user's wishlist
export const getWishlist = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/get-wishlist/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    toast.error('Error fetching wishlist', {
      position: 'top-right',
      autoClose: 3000
    });
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Get user's wishlist with department details
export const getWishlistWithDetails = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/get-wishlist-details/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    toast.error('Error fetching wishlist details', {
      position: 'top-right',
      autoClose: 3000
    });
    console.error('Error fetching wishlist details:', error);
    throw error;
  }
};

// Check if an item is in the wishlist
export const checkWishlist = async (userId, itemId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/check-wishlist/${userId}/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    throw error;
  }
};

// Get count of items in wishlist
export const getWishlistCount = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/get-wishlist-count/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.count;
  } catch (error) {
    console.error('Error fetching wishlist count:', error);
    return 0;
  }
};

// Clear all items from wishlist
export const clearWishlist = async (userId) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to clear all items from your wishlist?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, clear it!'
  });
  
  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/clear-wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Wishlist cleared successfully', {
        position: 'top-right',
        autoClose: 3000
      });
      
      return response.data;
    } catch (error) {
      toast.error('Error clearing wishlist', {
        position: 'top-right',
        autoClose: 3000
      });
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  } else {
    return null;
  }
};

// Get just the IDs of wishlisted items (for quick checks)
export const getWishlistedIds = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/get-wishlisted-ids/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.wishlistedIds;
  } catch (error) {
    console.error('Error fetching wishlisted IDs:', error);
    return [];
  }
};

export default {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getWishlistWithDetails,
  checkWishlist,
  getWishlistCount,
  clearWishlist,
  getWishlistedIds
};