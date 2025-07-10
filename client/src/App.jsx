import { useEffect, useState } from 'react'

function App() {
  const [airbnb, setAirbnb] = useState(null)
  const [wifi, setWifi] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchData = () => {
    fetch('http://localhost:5000/api/airbnb').then(res => res.json()).then(setAirbnb)
    fetch('http://localhost:5000/api/wifi').then(res => res.json()).then(setWifi)
    fetch('http://localhost:5000/api/weather').then(res => res.json()).then(setWeather)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🏠 Smart Airbnb Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Airbnb Metrics */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📊 Airbnb Stats</h2>
          {airbnb ? (
            <ul>
              <li>Bookings: {airbnb.bookings}</li>
              <li>Occupancy: {airbnb.occupancy}</li>
              <li>Revenue: {airbnb.revenue}</li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Wi-Fi Status */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📶 Wi-Fi</h2>
          {wifi ? (
            <ul>
              <li>Status: {wifi.status}</li>
              <li>Speed: {wifi.speed}</li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Weather Info */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">🌤️ Weather</h2>
          {weather ? (
            <ul>
              <li>Temp: {weather.temp}</li>
              <li>Condition: {weather.condition}</li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App



/*
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() =>{
    fetch("http://127.0.0.1:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  },[]);

  return (

    <div className="h-screen flex items-center justify-center bg-gray-100 text-xl font-semibold">
      <p>{message || "Loading..."}</p>
    </div>

    */

