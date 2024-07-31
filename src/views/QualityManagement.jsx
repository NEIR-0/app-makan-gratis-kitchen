import React, { useState, useEffect } from 'react';
import { Calendar, List, Truck, AlertCircle, ChevronsDown, MessageSquare, Bell, Send, CheckCircle, Plus } from 'lucide-react';

const QualityManagement = () => {
  const [complaints, setComplaints] = useState({
    unresolved: [
      { id: 1, subject: 'Sayur Layu', date: '1 Juli 2024', description: 'Sayur yang diterima dalam kondisi layu.' },
      { id: 2, subject: 'Buah Busuk', date: '2 Juli 2024', description: 'Sebagian buah dalam pengiriman sudah busuk.' },
    ],
    resolved: [
      { id: 3, subject: 'Telur Pecah', date: '28 Juni 2024', description: 'Beberapa telur dalam box pecah.', response: 'Mohon maaf atas ketidaknyamanannya. Kami akan mengirimkan penggantian untuk telur yang pecah dalam pengiriman berikutnya.' },
    ]
  });

  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ subject: '', description: '' });
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulasi menerima notifikasi dari backend
    const timer = setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Keluhan "Telur Pecah" telah ditanggapi' },
      ]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  const handleNewComplaintSubmit = (e) => {
    e.preventDefault();
    if (newComplaint.subject && newComplaint.description) {
      const complaint = {
        id: Date.now(),
        subject: newComplaint.subject,
        description: newComplaint.description,
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      setComplaints(prev => ({
        ...prev,
        unresolved: [complaint, ...prev.unresolved]
      }));
      setNewComplaint({ subject: '', description: '' });
      setShowNewComplaintForm(false);
    }
  };

  const handleExpandComplaint = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quality Management</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-teal-100 rounded-full text-teal-600 hover:bg-teal-200"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                <div className="py-2 px-4 text-sm font-medium border-b">Notifikasi</div>
                <ul className="py-2">
                  {notifications.map((notif) => (
                    <li key={notif.id} className="px-4 py-2 hover:bg-gray-100 text-sm flex justify-between items-center">
                      <span>{notif.message}</span>
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <CheckCircle size={16} />
                      </button>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="px-4 py-2 text-sm text-gray-500">Tidak ada notifikasi baru</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowNewComplaintForm(!showNewComplaintForm)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center"
          >
            <Plus size={18} className="mr-2" /> Buat Keluhan
          </button>
        </div>
      </div>

      {showNewComplaintForm && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Buat Keluhan Baru</h3>
          <form onSubmit={handleNewComplaintSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Subjek Keluhan"
              value={newComplaint.subject}
              onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Deskripsi Keluhan"
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
              className="w-full p-2 border rounded h-24"
            ></textarea>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              Kirim Keluhan
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Keluhan Belum Ditanggapi</h3>
        <ul className="space-y-4">
          {complaints.unresolved.map((complaint) => (
            <li key={complaint.id} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{complaint.subject}</span>
                <span className="text-sm text-red-500">Belum Ditanggapi</span>
              </div>
              <p className="text-sm text-gray-600">Tanggal: {complaint.date}</p>
              <p className="text-sm mt-1">{complaint.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Keluhan Sudah Ditanggapi</h3>
        <ul className="space-y-4">
          {complaints.resolved.map((complaint) => (
            <li key={complaint.id} className="border-b pb-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleExpandComplaint(complaint.id)}
              >
                <span className="font-medium">{complaint.subject}</span>
                <span className="text-sm text-green-500">Sudah Ditanggapi</span>
              </div>
              <p className="text-sm text-gray-600">Tanggal: {complaint.date}</p>
              {expandedComplaint === complaint.id && (
                <div className="mt-2 bg-gray-100 p-2 rounded">
                  <p className="text-sm font-medium">Keluhan:</p>
                  <p className="text-sm mb-2">{complaint.description}</p>
                  <p className="text-sm font-medium">Tanggapan:</p>
                  <p className="text-sm">{complaint.response}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QualityManagement;