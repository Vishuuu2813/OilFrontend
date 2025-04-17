import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/categories-with-count');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setCategories(data.data);
        } else {
          throw new Error(data.message || 'Error fetching categories');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Add new category with 0 count
        setCategories([...categories, { name: newCategoryName, count: 0 }]);
        setNewCategoryName('');
        setShowAddModal(false);
        
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to add category",
        variant: "destructive"
      });
    }
  };
  
  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/update-category/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ name: editingCategory.name })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Update category in list
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? { ...cat, name: editingCategory.name } : cat
        ));
        setEditingCategory(null);
        
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update category",
        variant: "destructive"
      });
    }
  };
  
  const startEdit = (category) => {
    setEditingCategory({ ...category });
  };
  
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This may affect departments using this category.`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/delete-category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Remove category from list
        setCategories(categories.filter(cat => cat.id !== categoryId));
        
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete category",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium">Error</h3>
          <p className="mt-2">{error}</p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <p className="mt-1 text-sm text-gray-600">Manage department categories and track statistics.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                type="button" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setShowAddModal(true)}
                disabled={!isAuthenticated}
              >
                <i className="fas fa-plus -ml-1 mr-2"></i>
                Add Category
              </button>
            </div>
          </div>
          
          {/* Categories Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Category Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Departments</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <tr key={category.id || index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {editingCategory && editingCategory.id === category.id ? (
                                <input 
                                  type="text" 
                                  value={editingCategory.name} 
                                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                />
                              ) : (
                                category.name
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{category.count || 0}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              {editingCategory && editingCategory.id === category.id ? (
                                <>
                                  <button 
                                    className="text-green-600 hover:text-green-900 mr-4"
                                    onClick={handleEditCategory}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    className="text-gray-600 hover:text-gray-900"
                                    onClick={() => setEditingCategory(null)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="text-primary-600 hover:text-primary-900 mr-4"
                                    onClick={() => startEdit(category)}
                                    disabled={!isAuthenticated}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteCategory(category.id, category.name)}
                                    disabled={!isAuthenticated}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center sm:pl-6">
                            No categories found. Click "Add Category" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="fas fa-tag text-primary-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Category
                    </h3>
                    <div className="mt-2">
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
