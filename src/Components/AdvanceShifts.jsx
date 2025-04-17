import React, { useState } from 'react';
import '../styles/AdvanceShifts.css';

const AdvanceShifts = () => {
  const [shifts, setShifts] = useState([
    { id: 1, department: 'HR', hours: 5, value: 100, advance: false },
    { id: 2, department: 'Finance', hours: 8, value: 150, advance: false },
    { id: 3, department: 'IT', hours: 3, value: 80, advance: false },
  ]);

  const [sortOrder, setSortOrder] = useState('ascending');

  // Handle advance shift toggle
  const toggleAdvance = (id) => {
    setShifts(shifts.map(shift =>
      shift.id === id ? { ...shift, advance: !shift.advance } : shift
    ));
  };

  // Sort shifts based on hours
  const sortedShifts = [...shifts].sort((a, b) =>
    sortOrder === 'ascending' ? a.hours - b.hours : b.hours - a.hours
  );

  // Calculate percentage splits (example: 30/70 split)
  const calculateSplit = (value) => {
    const part1 = Math.round(value * 0.3);
    const part2 = value - part1;
    return `${part1} / ${part2}`;
  };

  return (
    <div className="advance-shifts-container">
      <h2>Advance Shifts Management</h2>

      <div className="sort-options">
        <label>Sort Order:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Hours</th>
            <th>Value Split</th>
            <th>Advance Shift</th>
          </tr>
        </thead>
        <tbody>
          {sortedShifts.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.department}</td>
              <td>{shift.hours}</td>
              <td>{calculateSplit(shift.value)}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={shift.advance}
                    onChange={() => toggleAdvance(shift.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvanceShifts;
