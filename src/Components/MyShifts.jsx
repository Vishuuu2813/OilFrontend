import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const MyShifts = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [shifts, setShifts] = useState({
    active: [],
    upcoming: [],
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchShifts = async () => {
      try {
        setLoading(true);
        
        // Fetch active shifts
        const activeResponse = await fetch('http://localhost:8000/api/my-shifts/active', {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        
        if (!activeResponse.ok) {
          throw new Error('Failed to fetch active shifts');
        }
        
        const activeData = await activeResponse.json();
        
        // Fetch upcoming shifts
        const upcomingResponse = await fetch('http://localhost:8000/api/my-shifts/upcoming', {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        
        if (!upcomingResponse.ok) {
          throw new Error('Failed to fetch upcoming shifts');
        }
        
        const upcomingData = await upcomingResponse.json();
        
        // Fetch shift history
        const historyResponse = await fetch('http://localhost:8000/api/my-shifts/history', {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        
        if (!historyResponse.ok) {
          throw new Error('Failed to fetch shift history');
        }
        
        const historyData = await historyResponse.json();
        
        setShifts({
          active: activeData.status === 'success' ? activeData.data : [],
          upcoming: upcomingData.status === 'success' ? upcomingData.data : [],
          history: historyData.status === 'success' ? historyData.data : []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError(err.message || 'Failed to fetch shifts');
        setLoading(false);
      }
    };
    
    fetchShifts();
  }, [isAuthenticated]);

  // Function to calculate elapsed time
  const calculateElapsedTime = (startTime) => {
    if (!startTime) return '0h 0m';
    
    const start = new Date(startTime);
    const now = new Date();
    const elapsed = now - start;
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Function to calculate progress percentage
  const calculateProgress = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    const percentage = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };
  
  // Function to calculate remaining time
  const calculateRemainingTime = (endTime) => {
    if (!endTime) return '0h 0m';
    
    const end = new Date(endTime);
    const now = new Date();
    
    if (now > end) return 'Completed';
    
    const remaining = end - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  // Function to handle pausing a shift
  const handlePauseShift = async (shiftId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/pause-shift/${shiftId}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        toast({
          title: "Shift paused",
          description: "Your shift has been paused successfully.",
        });
        
        // Update the shift in the active shifts list
        setShifts(prev => ({
          ...prev,
          active: prev.active.map(shift => 
            shift.id === shiftId ? { ...shift, status: 'paused' } : shift
          )
        }));
      } else {
        throw new Error(data.message || 'Failed to pause shift');
      }
    } catch (err) {
      console.error('Error pausing shift:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to pause shift",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle resuming a shift
  const handleResumeShift = async (shiftId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/resume-shift/${shiftId}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        toast({
          title: "Shift resumed",
          description: "Your shift has been resumed successfully.",
        });
        
        // Update the shift in the active shifts list
        setShifts(prev => ({
          ...prev,
          active: prev.active.map(shift => 
            shift.id === shiftId ? { ...shift, status: 'active' } : shift
          )
        }));
      } else {
        throw new Error(data.message || 'Failed to resume shift');
      }
    } catch (err) {
      console.error('Error resuming shift:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to resume shift",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle ending a shift
  const handleEndShift = async (shiftId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/end-shift/${shiftId}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        toast({
          title: "Shift ended",
          description: "Your shift has been completed successfully.",
        });
        
        // Remove the shift from active and add to history
        const endedShift = shifts.active.find(shift => shift.id === shiftId);
        
        setShifts(prev => ({
          ...prev,
          active: prev.active.filter(shift => shift.id !== shiftId),
          history: endedShift ? [{ ...endedShift, status: 'completed', endedAt: new Date().toISOString() }, ...prev.history] : prev.history
        }));
      } else {
        throw new Error(data.message || 'Failed to end shift');
      }
    } catch (err) {
      console.error('Error ending shift:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to end shift",
        variant: "destructive"
      });
    }
  };

  // Function to handle cancelling an upcoming shift
  const handleCancelShift = async (shiftId) => {
    if (!confirm('Are you sure you want to cancel this shift?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/cancel-shift/${shiftId}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        toast({
          title: "Shift cancelled",
          description: "Your shift has been cancelled successfully.",
        });
        
        // Remove the shift from upcoming
        setShifts(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(shift => shift.id !== shiftId)
        }));
      } else {
        throw new Error(data.message || 'Failed to cancel shift');
      }
    } catch (err) {
      console.error('Error cancelling shift:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to cancel shift",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <i className="fas fa-lock text-gray-400 text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need to be logged in to view your shifts.
          </p>
          <a 
            href="/login" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shifts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          <h2 className="text-lg font-semibold text-gray-900">My Shifts</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your booked and active shifts.</p>
          
          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <div className="-mb-px flex space-x-8" aria-label="Tabs">
              <button 
                className={`${activeTab === 'active' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('active')}
              >
                Active Shifts
              </button>
              <button 
                className={`${activeTab === 'upcoming' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Shifts
              </button>
              <button 
                className={`${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('history')}
              >
                Shift History
              </button>
            </div>
          </div>
          
          {/* Active Shifts */}
          {activeTab === 'active' && (
            <div className="mt-6">
              {shifts.active.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shifts.active.map((shift) => (
                    <div key={shift.id} className="bg-white overflow-hidden shadow rounded-lg border border-green-200">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <i className={`fas ${shift.status === 'paused' ? 'fa-pause' : 'fa-play'} text-green-600`}></i>
                          </div>
                          <div className="ml-5 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{shift.departmentName}</h3>
                            <p className="text-sm text-gray-500">{shift.location}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Started</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(shift.startTime).toLocaleString()}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Expected End</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(shift.endTime).toLocaleString()}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Elapsed</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {calculateElapsedTime(shift.startTime)}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                              <dd className="mt-1 text-sm text-gray-900">${shift.amount}/hour</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div className="mt-5">
                          <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`${shift.status === 'paused' ? 'bg-yellow-600' : 'bg-green-600'} h-2.5 rounded-full`}
                              style={{ width: `${calculateProgress(shift.startTime, shift.endTime)}%` }}
                            ></div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {calculateRemainingTime(shift.endTime)}
                          </p>
                        </div>
                        
                        <div className="mt-5 flex space-x-3">
                          {shift.status === 'paused' ? (
                            <button 
                              type="button"
                              onClick={() => handleResumeShift(shift.id)} 
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <i className="fas fa-play mr-2"></i> Resume Shift
                            </button>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => handlePauseShift(shift.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              <i className="fas fa-pause mr-2"></i> Pause Shift
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleEndShift(shift.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <i className="fas fa-stop-circle mr-2"></i> End Shift
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <i className="fas fa-clock text-gray-400 text-6xl mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900">No active shifts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any active shifts right now. Browse departments to book a new shift.
                  </p>
                  <a 
                    href="/departments" 
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Find Departments
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Upcoming Shifts */}
          {activeTab === 'upcoming' && (
            <div className="mt-6">
              {shifts.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shifts.upcoming.map((shift) => (
                    <div key={shift.id} className="bg-white overflow-hidden shadow rounded-lg border border-primary-200">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                            <i className="fas fa-calendar-alt text-primary-600"></i>
                          </div>
                          <div className="ml-5 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{shift.departmentName}</h3>
                            <p className="text-sm text-gray-500">{shift.location}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Booked On</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(shift.bookedAt).toLocaleDateString()}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Expires On</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {shift.expiryDate ? new Date(shift.expiryDate).toLocaleDateString() : 'Not set'}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Shift Hours</dt>
                              <dd className="mt-1 text-sm text-gray-900">{shift.shiftHours || 'Not set'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                              <dd className="mt-1 text-sm text-gray-900">${shift.amount}/hour</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div className="mt-5 flex flex-col space-y-2">
                          <button 
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={() => {
                              window.location.href = `/departments?start=${shift.id}`;
                            }}
                          >
                            <i className="fas fa-play mr-2"></i> Start Shift Now
                          </button>
                          <button 
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleCancelShift(shift.id)}
                          >
                            <i className="fas fa-times mr-2"></i> Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <i className="fas fa-calendar text-gray-400 text-6xl mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900">No upcoming shifts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any upcoming shifts booked. Browse departments to book a new shift.
                  </p>
                  <a 
                    href="/departments" 
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Find Departments
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Shift History */}
          {activeTab === 'history' && (
            <div className="mt-6">
              {shifts.history.length > 0 ? (
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Department</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hours</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {shifts.history.map((shift) => {
                              // Calculate hours worked
                              const startTime = new Date(shift.startTime);
                              const endTime = new Date(shift.endedAt || shift.endTime);
                              const hoursWorked = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(1);
                              
                              // Calculate amount
                              const amount = (parseFloat(hoursWorked) * parseFloat(shift.amount || 0)).toFixed(2);
                              
                              return (
                                <tr key={shift.id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {shift.departmentName}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {new Date(shift.startTime).toLocaleDateString()}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {hoursWorked}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${shift.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        shift.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                        'bg-gray-100 text-gray-800'}`}>
                                      {shift.status === 'completed' ? 'Completed' : 
                                       shift.status === 'cancelled' ? 'Cancelled' : 
                                       'Unknown'}
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    ${amount}
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button className="text-primary-600 hover:text-primary-900">
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <i className="fas fa-history text-gray-400 text-6xl mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900">No shift history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any completed shifts yet. Your shift history will appear here after you complete shifts.
                  </p>
                  <a 
                    href="/departments" 
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Find Departments
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShifts;
