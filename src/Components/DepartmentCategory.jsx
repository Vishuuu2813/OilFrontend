import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the standalone sidebar component

function DepartmnentCategory() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://oil-backend-maxf.vercel.appcategories-with-count");
      const data = await res.json();
      if (data.status === "success") {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!category.trim()) return;
    try {
      const res = await fetch("https://oil-backend-maxf.vercel.appadd-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setCategory("");
        fetchCategories(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        activePage="users"
      />

      <div className={`main ${sidebarCollapsed ? 'main-expanded' : ''}`}>
        <h1>Department Categories</h1>
        
        <div className="category-section">
          <h2>Add Department Category</h2>
          <div className="input-group">
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="Enter category name" 
              className="category-input"
            />
            <button onClick={handleAdd} className="add-button">Add</button>
          </div>

          <div className="refresh-row">
            <h3>All Categories</h3>
            <button className="refresh-button" onClick={fetchCategories}>🔁 Refresh</button>
          </div>

          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Departments</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr key={i}>
                    <td>{cat.name}</td>
                    <td>{cat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          background-color: #f7fafc;
        }

        .main {
          flex: 1;
          margin-left: 280px;
          padding: 20px;
          transition: margin-left 0.3s ease;
        }

        .main-expanded {
          margin-left: 80px;
        }

        .category-section {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .input-group {
          display: flex;
          margin-bottom: 20px;
        }

        .category-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .add-button {
          margin-left: 10px;
          padding: 10px 20px;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .add-button:hover {
          background-color: #3182ce;
        }

        .table-container {
          overflow-x: auto;
        }

        .categories-table {
          width: 100%;
          border-collapse: collapse;
        }

        .categories-table th,
        .categories-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .categories-table th {
          background-color: #f7fafc;
          font-weight: 500;
        }

        .refresh-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        }

        .refresh-button {
          padding: 6px 12px;
          background-color: #38a169;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-button:hover {
          background-color: #2f855a;
        }

        @media (max-width: 768px) {
          .main {
            margin-left: 80px;
          }

          .main-expanded {
            margin-left: 0;
          }

          .input-group {
            flex-direction: column;
          }

          .add-button {
            margin-left: 0;
            margin-top: 10px;
          }

          .refresh-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .refresh-button {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default DepartmnentCategory;
