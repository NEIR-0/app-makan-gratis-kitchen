import React, { useState, useEffect } from 'react';
import { Bell, ChevronsDown, Send, CheckCircle } from 'lucide-react';
import menuBulanan from '../../data/menuBulanan.json';

const MenuHarian = () => {
    const [activeView, setActiveView] = useState('harian');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCookForm, setShowCookForm] = useState(false);
    const [cookSupplies, setCookSupplies] = useState({});
    const [currentSupplies, setCurrentSupplies] = useState({
        daging: 500,
        ikan: 300,
        sayur: 200,
        beras: 1000,
    });
    const [menuCompleted, setMenuCompleted] = useState(false);
    const [showRequestConfirmation, setShowRequestConfirmation] = useState(false);
    const [requestedItem, setRequestedItem] = useState('');
    const [requestedItems, setRequestedItems] = useState({});

  
    // Simulasi data menu
    const menuHarian = [
      { id: 1, nama: 'Nasi Goreng Sayur', kategori: 'Makanan Utama' },
      { id: 2, nama: 'Sup Ayam', kategori: 'Sup' },
      { id: 3, nama: 'Tumis Kangkung', kategori: 'Sayuran' },
      { id: 4, nama: 'Buah Potong', kategori: 'Dessert' },
    ];

    useEffect(() => {
      // Simulasi menerima notifikasi dari database
      const timer = setTimeout(() => {
        setNotifications([
          { id: 1, pesan: 'Menu hari Senin telah diubah' },
          { id: 2, pesan: 'Menu baru ditambahkan untuk minggu depan' },
        ]);
      }, 3000);
  
      return () => clearTimeout(timer);
    }, []);

    const handleCookSubmit = (e) => {
      e.preventDefault();
      const newSupplies = { ...currentSupplies };
      let lowSupplies = [];
      
      Object.keys(cookSupplies).forEach(item => {
        newSupplies[item] -= Number(cookSupplies[item]);
        if (newSupplies[item] < 100) { // Asumsi batas "low supply" adalah 100
          lowSupplies.push(item);
        }
      });

      setCurrentSupplies(newSupplies);
      setCookSupplies({});
      setShowCookForm(false);
      setMenuCompleted(true);

      if (lowSupplies.length > 0) {
        setNotifications(prev => [
          ...prev,
          { id: Date.now(), pesan: `Stok ${lowSupplies.join(', ')} sudah rendah. Pertimbangkan untuk request ke ULP.` }
        ]);
      }
    };

    const requestToULP = (item) => {
      setRequestedItem(item);
      setShowRequestConfirmation(true);
      setRequestedItems(prev => ({ ...prev, [item]: true }));
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), pesan: `Request pengisian ${item} telah dikirim ke ULP.` }
      ]);
      
      // Menutup pop-up konfirmasi setelah 3 detik
      setTimeout(() => {
        setShowRequestConfirmation(false);
      }, 3000);
    };
  
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Menu</h2>
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
                      {notif.pesan}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveView('harian')}
              className={`px-4 py-2 rounded ${
                activeView === 'harian' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}
            >
              Menu Harian
            </button>
            <button
              onClick={() => setActiveView('bulanan')}
              className={`px-4 py-2 rounded ${
                activeView === 'bulanan' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}
            >
              Menu Bulanan
            </button>
          </div>
  
          {activeView === 'harian' ? (
            <div>
              <h3 className="font-medium mb-2">Menu Hari Ini</h3>
              <ul className="space-y-2">
                {menuHarian.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2">
                    <span>{item.nama}</span>
                    <span className="text-sm text-gray-500">{item.kategori}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setShowCookForm(true)}
                  className={`bg-teal-600 text-white px-4 py-2 rounded ${
                    menuCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
                  }`}
                  disabled={menuCompleted}
                >
                  Masak
                </button>
                {menuCompleted && (
                  <span className="text-green-600 font-medium">Masak Hari Ini Selesai</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2">Menu Bulan Ini</h3>
              <div className="space-y-4">
                {menuBulanan.map((hari, index) => (
                  <div key={index} className="border-b pb-2">
                    <h4 className="font-medium text-teal-600">{hari.tanggal}</h4>
                    <ul className="list-disc list-inside">
                      {hari.menu.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showCookForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-medium mb-4">Masukkan Jumlah Supply yang Digunakan</h3>
              <form onSubmit={handleCookSubmit} className="space-y-4">
                {Object.keys(currentSupplies).map(item => (
                  <div key={item} className="flex justify-between items-center">
                    <label>{item}</label>
                    <input
                      type="number"
                      value={cookSupplies[item] || ''}
                      onChange={(e) => setCookSupplies({...cookSupplies, [item]: e.target.value})}
                      className="border rounded px-2 py-1 w-24"
                      min="0"
                      max={currentSupplies[item]}
                    />
                  </div>
                ))}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCookForm(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <h3 className="font-medium mb-2">Stok Saat Ini</h3>
          <ul className="space-y-2">
            {Object.entries(currentSupplies).map(([item, quantity]) => (
              <li key={item} className="flex justify-between items-center">
                <span>{item}</span>
                <div>
                  <span className={`mr-2 ${quantity < 100 ? 'text-red-500' : 'text-green-500'}`}>
                    {quantity} kg
                  </span>
                  {quantity < 100 && (
                    <button
                      onClick={() => requestToULP(item)}
                      className={`px-2 py-1 rounded text-xs ${
                        requestedItems[item]
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white`}
                      disabled={requestedItems[item]}
                    >
                      {requestedItems[item] ? (
                        <>
                          <CheckCircle size={12} className="inline mr-1" /> Request Sent
                        </>
                      ) : (
                        <>
                          <Send size={12} className="inline mr-1" /> Request ULP
                        </>
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pop-up konfirmasi request ULP */}
        {showRequestConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle size={24} className="mr-2" />
                <span className="text-lg font-medium">Request Terkirim</span>
              </div>
              <p className="text-gray-700">
                Permintaan pengisian {requestedItem} telah berhasil dikirim ke ULP.
              </p>
            </div>
          </div>
        )}
      </div>
    );
};

export default MenuHarian;