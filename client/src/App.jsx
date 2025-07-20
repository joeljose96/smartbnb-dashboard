import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';

function App() {
  const [airbnb, setAirbnb] = useState(null);
  const [weather, setWeather] = useState(null);
  const [internet, setInternet] = useState(null);
  const [guestinfo, setGuestInfo] = useState(null);

  const [accessGranted, setAccessGranted] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const correctCode = "1234"; // Change this to your actual code

  // Fetch data from backend
  const fetchAirbnb = () => {
    fetch('http://localhost:5000/api/airbnb')
      .then(res => res.json())
      .then(setAirbnb);
  };

  const fetchWeather = () => {
    fetch('http://localhost:5000/api/weather')
      .then(res => res.json())
      .then(setWeather);
  };

  const fetchInternet = () => {
    fetch('http://localhost:5000/api/internet')
      .then(res => res.json())
      .then(setInternet);
  };

  const fetchGuestInfo = () => { 
    fetch('http://localhost:5000/api/sheet')
    .then(res => res.json())
    .then(setGuestInfo);
  };

  // Fetch all data initially and every 60 seconds
  useEffect(() => {
    fetchAirbnb();
    fetchWeather();
    fetchInternet();
    fetchGuestInfo();

    const interval = setInterval(() => {
      fetchAirbnb();
      fetchWeather();
      fetchInternet();
      fetchGuestInfo();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const goFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  

  // 🔐 Access code prompt
  if (!accessGranted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow text-center w-full max-w-sm">
          {/* Fullscreen Button */}
      <button
        onClick={goFullscreen}
        className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded shadow"
      >
        Fullscreen
      </button>
          <h2 className="text-xl font-semibold mb-4">🔐 Enter Access Code</h2>
          <input
            type="password"
            className="border rounded px-4 py-2 w-full mb-4"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Access Code"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              if (codeInput === correctCode) {
                setAccessGranted(true);
              } else {
                alert("Incorrect code");
              }
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">🏠 SmartBnB Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Airbnb Stats */}
        {airbnb && (
          <motion.div
            className="bg-white p-4 rounded-2xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">📊 Airbnb Stats</h2>
            <p>Bookings: <strong>{airbnb.bookings}</strong></p>
            <p>Occupancy: <strong>{airbnb.occupancy}</strong></p>
            <p>Revenue: <strong>{airbnb.revenue}</strong></p>
          </div>
          </motion.div>
        )}

        {/* Weather Card */}
        {weather && (
          <motion.div
            className="bg-white p-4 rounded-2xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">🌤️ Local Weather</h2>
            <p className="text-2xl">{weather.temp}°C</p>
            <p>{weather.condition}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Weather icon"
              className="w-16 h-16"
            />
          </div>
          </motion.div>
        )}

        {/* Internet Speed */}
        {internet && (
          <motion.div
            className="bg-white p-4 rounded-2xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">📶 Wi-Fi Speed</h2>
            <p>Download: {internet.download}</p>
            <p>Upload: {internet.upload}</p>
            <p>Ping: {internet.ping}</p>
          </div>
          </motion.div>
        )}

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h2 className="text-xl font-semibold mb-4">📱 Open Dashboard</h2>
          <QRCodeCanvas
            value="http://192.168.1.136:5173"  // ⬅️ Replace with your Pi's actual local IP!
            size={150}
            includeMargin={true}
          />
          <p className="mt-2 text-sm text-gray-500">Scan to open on your phone</p>
        </div>


        {/* Guest Info Card */}
        {guestInfo.length > 0 && (
          <motion.div
            className="bg-white p-4 rounded-2xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🛎️ Guest Info</h2>
          <ul className="space-y-2">
            {guestInfo.map((item, index) => (
              <li key={index}>
                <span className="font-semibold">{item.title}:</span> {item.message}
              </li>
            ))}
          </ul>
        </div>
        </motion.div>
      )}

      </div>
    </div>
  );
}

export default App;

