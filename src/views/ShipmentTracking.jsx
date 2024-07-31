import React, { useState, useEffect } from 'react';
import { CheckCircle, Bell, Package } from 'lucide-react';

const ShipmentTracking = () => {
  const [shipments, setShipments] = useState({
    inTransit: [
      { id: '12345', estimasi: '2 Juli 2024', status: 'Dalam Perjalanan', items: [
        { name: 'Daging', quantity: '100 kg' },
        { name: 'Telur', quantity: '200 kg' },
      ]},
      { id: '12346', estimasi: '5 Juli 2024', status: 'Diproses', items: [
        { name: 'Beras', quantity: '500 kg' },
        { name: 'Minyak Goreng', quantity: '100 L' },
      ]},
    ],
    arrived: [
      { id: '12344', tanggalTiba: '1 Juli 2024', status: 'Sampai Tujuan', items: [
        { name: 'Sayur Kangkung', quantity: '50 kg' },
        { name: 'Wortel', quantity: '100 kg' },
      ]},
    ],
    confirmed: []
  });

  const [expandedShipment, setExpandedShipment] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulasi menerima notifikasi dari backend
    const timer = setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Pengiriman baru #12347 telah dibuat', isRead: false },
        { id: 2, message: 'Status pengiriman #12345 telah berubah menjadi "Dalam Perjalanan"', isRead: false },
      ]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleExpand = (id) => {
    setExpandedShipment(expandedShipment === id ? null : id);
  };

  const handleConfirmShipment = (id) => {
    const shipmentToConfirm = shipments.arrived.find(s => s.id === id);
    if (shipmentToConfirm) {
      setShipments(prev => ({
        ...prev,
        arrived: prev.arrived.filter(s => s.id !== id),
        confirmed: [...prev.confirmed, {...shipmentToConfirm, status: 'Shipping Confirmed'}]
      }));
      // Menambahkan notifikasi baru untuk konfirmasi pengiriman
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), message: `Pengiriman #${id} telah dikonfirmasi`, isRead: false }
      ]);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Shipment Tracking</h2>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-teal-100 rounded-full text-teal-600 hover:bg-teal-200"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
              <div className="py-2 px-4 text-sm font-medium border-b">Notifikasi Pengiriman</div>
              <ul className="py-2 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <li 
                    key={notif.id} 
                    className={`px-4 py-2 hover:bg-gray-100 text-sm flex items-center ${notif.isRead ? 'text-gray-500' : 'text-teal-600 font-semibold'}`}
                  >
                    <Package size={16} className="mr-2" />
                    <span>{notif.message}</span>
                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="ml-auto text-teal-600 hover:text-teal-800"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="px-4 py-2 text-sm text-gray-500">Tidak ada notifikasi baru</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Pengiriman Dalam Perjalanan</h3>
        <ul className="space-y-4">
          {shipments.inTransit.map((shipment) => (
            <li key={shipment.id} className="border-b pb-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleExpand(shipment.id)}
              >
                <span className="font-medium">No. PO: {shipment.id}</span>
                <span className="text-sm text-teal-600">Estimasi: {shipment.estimasi}</span>
              </div>
              <p className="text-sm text-gray-600">Status: {shipment.status}</p>
              {expandedShipment === shipment.id && (
                <ul className="mt-2 pl-4 text-sm">
                  {shipment.items.map((item, index) => (
                    <li key={index}>{item.name}: {item.quantity}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Pengiriman Sampai Tujuan</h3>
        <ul className="space-y-4">
          {shipments.arrived.map((shipment) => (
            <li key={shipment.id} className="border-b pb-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleExpand(shipment.id)}
              >
                <span className="font-medium">No. PO: {shipment.id}</span>
                <span className="text-sm text-green-600">Tiba: {shipment.tanggalTiba}</span>
              </div>
              <p className="text-sm text-gray-600">Status: {shipment.status}</p>
              {expandedShipment === shipment.id && (
                <div>
                  <ul className="mt-2 pl-4 text-sm">
                    {shipment.items.map((item, index) => (
                      <li key={index}>{item.name}: {item.quantity}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleConfirmShipment(shipment.id)}
                    className="mt-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center justify-center w-full"
                  >
                    <CheckCircle size={18} className="mr-2" /> Konfirmasi Pengiriman
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Pengiriman Dikonfirmasi</h3>
        <ul className="space-y-4">
          {shipments.confirmed.map((shipment) => (
            <li key={shipment.id} className="border-b pb-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleExpand(shipment.id)}
              >
                <span className="font-medium">No. PO: {shipment.id}</span>
                <span className="text-sm text-blue-600">Dikonfirmasi: {shipment.tanggalTiba}</span>
              </div>
              <p className="text-sm text-gray-600">Status: {shipment.status}</p>
              {expandedShipment === shipment.id && (
                <ul className="mt-2 pl-4 text-sm">
                  {shipment.items.map((item, index) => (
                    <li key={index}>{item.name}: {item.quantity}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShipmentTracking;