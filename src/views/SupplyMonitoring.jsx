import React, { useState, useEffect } from 'react';
import {  ChevronsDown, Bell, Send } from 'lucide-react';

const SupplyMonitoring = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestSent, setShowRequestSent] = useState(false);

  const lowStockItems = [
    { name: 'Beras', quantity: '10 kg', threshold: '50 kg' },
    { name: 'Minyak Goreng', quantity: '5 L', threshold: '20 L' },
  ];

  const inventory = [
    { name: 'Ikan', quantity: '20 kg' },
    { name: 'Daging', quantity: '100 kg' },
    { name: 'Telur', quantity: '1000 butir' },
    { name: 'Sayur Kangkung', quantity: '30 kg' },
    { name: 'Wortel', quantity: '50 kg' },
  ];

  useEffect(() => {
    // Simulasi menerima notifikasi dari database
    const timer = setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Stok beras hampir habis' },
        { id: 2, message: 'Minyak goreng perlu diisi ulang' },
      ]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendRequest = () => {
    setShowRequestSent(true);
    setTimeout(() => setShowRequestSent(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Supply Monitoring</h2>
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
                  <li key={notif.id} className="px-4 py-2 hover:bg-gray-100 text-sm">
                    {notif.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Stok Rendah</h3>
          <ul className="space-y-2">
            {lowStockItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-red-500 flex items-center">
                  <ChevronsDown size={18} className="mr-1" /> {item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSendRequest}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center justify-center w-full"
          >
            <Send size={18} className="mr-2" /> Kirim Permintaan ke ULP
          </button>
          {showRequestSent && (
            <div className="mt-2 text-center text-green-600">
              Permintaan terkirim ke ULP
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Inventori Saat Ini</h3>
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-teal-600">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupplyMonitoring;