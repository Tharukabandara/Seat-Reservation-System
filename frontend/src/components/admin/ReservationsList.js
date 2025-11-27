import React, { useState } from 'react';

const ReservationsList = ({ reservations }) => {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-800 bg-green-100';
      case 'cancelled': return 'text-red-800 bg-red-100';
      case 'completed': return 'text-gray-800 bg-gray-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter !== 'all' && reservation.status !== filter) {
      return false;
    }
    
    if (dateFilter) {
      const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
      if (reservationDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });

  const groupedReservations = filteredReservations.reduce((acc, reservation) => {
    const date = new Date(reservation.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reservation);
    return acc;
  }, {});

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'active').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    completed: reservations.filter(r => r.status === 'completed').length
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <span className="text-2xl">✔️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Reservations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        
        {(filter !== 'all' || dateFilter) && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setFilter('all');
                setDateFilter('');
              }}
              className="btn-secondary text-sm"
            >
              Clear Filters
            </button>
            <span className="text-sm text-gray-600 flex items-center">
              Showing {filteredReservations.length} of {reservations.length} reservations
            </span>
          </div>
        )}
      </div>

      {/* Reservations List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Reservations
        </h2>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-xl text-gray-600 mb-2">No reservations found</p>
            <p className="text-gray-500">
              {reservations.length === 0 
                ? 'No reservations have been made yet.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedReservations).map(([date, dateReservations]) => (
              <div key={date}>
                <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">
                  {date} ({dateReservations.length} reservations)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Intern</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Seat</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Location</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Time Slot</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Booked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dateReservations.map((reservation) => (
                        <tr key={reservation._id} className="border-b border-gray-100">
                          <td className="py-3 px-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {reservation.intern?.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {reservation.intern?.email || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">🪑</span>
                              <span className="font-medium text-gray-900">
                                {reservation.seat?.seatNumber || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600">
                            {reservation.seat?.location || 'N/A'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="capitalize text-gray-600">
                              {reservation.timeSlot}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(reservation.status)}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-500">
                            {new Date(reservation.createdAt).toLocaleDateString()}
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

export default ReservationsList;