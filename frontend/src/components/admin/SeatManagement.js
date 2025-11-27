import React, { useState } from 'react';
import { seatsAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const SeatManagement = ({ seats, onSeatCreated, onSeatUpdated, onSeatDeleted }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [formData, setFormData] = useState({
    seatNumber: '',
    location: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingSeat) {
        // Update existing seat
        const response = await seatsAPI.updateSeat(editingSeat._id, formData);
        onSeatUpdated(response.data);
        setEditingSeat(null);
      } else {
        // Create new seat
        const response = await seatsAPI.createSeat(formData);
        onSeatCreated(response.data);
        setIsCreating(false);
      }
      
      setFormData({
        seatNumber: '',
        location: '',
        status: 'available'
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save seat');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seat) => {
    setEditingSeat(seat);
    setFormData({
      seatNumber: seat.seatNumber,
      location: seat.location,
      status: seat.status
    });
    setIsCreating(true);
    setError('');
  };

  const handleDelete = async (seatId) => {
    if (!window.confirm('Are you sure you want to delete this seat?')) {
      return;
    }

    try {
      await seatsAPI.deleteSeat(seatId);
      onSeatDeleted(seatId);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete seat');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSeat(null);
    setFormData({
      seatNumber: '',
      location: '',
      status: 'available'
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    const location = seat.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(seat);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-800 bg-green-100';
      case 'unavailable': return 'text-red-800 bg-red-100';
      case 'maintenance': return 'text-yellow-800 bg-yellow-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div>
      {/* Add/Edit Seat Form */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingSeat ? 'Edit Seat' : 'Seat Management'}
          </h2>
          {!isCreating && !editingSeat && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              Add New Seat
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {(isCreating || editingSeat) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700">
                  Seat Number
                </label>
                <input
                  type="text"
                  id="seatNumber"
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="e.g., A1, B2, C3"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location/Area
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="e.g., Main Floor, Window Side"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field mt-1"
                  required
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? <LoadingSpinner size="sm" /> : (editingSeat ? 'Update Seat' : 'Add Seat')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Seats List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Seats ({seats.length})
        </h2>

        {seats.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🪑</span>
            <p className="text-xl text-gray-600 mb-2">No seats added yet</p>
            <p className="text-gray-500 mb-6">
              Start by adding your first seat to the system.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              Add First Seat
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSeats).map(([location, locationSeats]) => (
              <div key={location}>
                <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">
                  {location} ({locationSeats.length} seats)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Seat Number</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Created</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationSeats.map((seat) => (
                        <tr key={seat._id} className="border-b border-gray-100">
                          <td className="py-3 px-3">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">🪑</span>
                              <span className="font-medium text-gray-900">{seat.seatNumber}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(seat.status)}`}>
                              {seat.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-600">
                            {new Date(seat.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(seat)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(seat._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatManagement;