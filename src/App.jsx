import React, { useState, useEffect } from 'react';
import { Calendar, List, Truck, AlertCircle, Bell } from 'lucide-react';
import MenuHarian from './views/MenuHarian';
import SupplyMonitoring from './views/SupplyMonitoring';
import ShipmentTracking from './views/ShipmentTracking';
import QualityManagement from './views/QualityManagement';

const DapurDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'menu', icon: Calendar, label: 'Menu Harian' },
    { id: 'supply', icon: List, label: 'Supply Monitoring' },
    { id: 'shipment', icon: Truck, label: 'Shipment Tracking' },
    { id: 'quality', icon: AlertCircle, label: 'Quality Management' },
  ];

  useEffect(() => {
    // Simulasi menerima notifikasi dari backend
    const initialNotifications = [
      { id: 1, message: 'New notification on Supply Monitoring', page: 'supply', read: false },
      { id: 2, message: 'New notification on Shipment Tracking', page: 'shipment', read: false },
      { id: 3, message: 'New notification on Quality Management', page: 'quality', read: true },
    ];
    setNotifications(initialNotifications);
  }, []);

  const handleNotificationClick = (notificationId, page) => {
    // Menandai notifikasi sebagai sudah dibaca
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    // Mengarahkan ke halaman yang sesuai
    setActiveTab(page);
    // Menutup dropdown notifikasi
    setShowNotifications(false);
  };


  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <header className="bg-teal-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Dapur</h1>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-teal-500 rounded-full text-white hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 text-slate-800">
              <div className="py-2 px-4 text-sm font-medium border-b">Notifikasi</div>
              <ul className="py-2 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <li 
                    key={notif.id} 
                    className={`px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ${notif.read ? 'text-gray-500' : 'text-teal-600 font-semibold'}`}
                    onClick={() => handleNotificationClick(notif.id, notif.page)}
                  >
                    {notif.message}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="px-4 py-2 text-sm text-gray-500">Tidak ada notifikasi baru</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-teal-700 text-white p-4">
          <nav>
            <ul>
              {tabs.map((tab) => (
                <li key={tab.id} className="mb-2">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full p-2 rounded ${
                      activeTab === tab.id ? 'bg-teal-800' : 'hover:bg-teal-600'
                    }`}
                  >
                    <tab.icon className="mr-2" size={18} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {activeTab === 'menu' && <MenuHarian />}
          {activeTab === 'supply' && <SupplyMonitoring />}
          {activeTab === 'shipment' && <ShipmentTracking />}
          {activeTab === 'quality' && <QualityManagement />}
        </main>
      </div>
    </div>
  );
};

export default DapurDashboard;