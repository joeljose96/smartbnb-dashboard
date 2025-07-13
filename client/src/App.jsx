import { useEffect, useState } from 'react'

function App() {
  const [airbnb, setAirbnb] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [editData, setEditData] = useState({ bookings: '', occupancy: '', revenue: '' })

  const fetchData = () => {
    fetch('http://localhost:5000/api/airbnb').then(res => res.json()).then(data => {
      setAirbnb(data)
      setEditData(data)
    })
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSave = () => {
    fetch('http://localhost:5000/api/airbnb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    }).then(() => fetchData())
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">🏠 Smart Airbnb Dashboard</h1>
        <button
          onClick={() => setIsHost(!isHost)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow"
        >
          {isHost ? 'Guest View' : 'Host Login'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Airbnb Stats</h2>
          {airbnb ? (
            isHost ? (
              <div className="space-y-2">
                <input className="w-full border rounded p-2" placeholder="Bookings"
                  value={editData.bookings} onChange={e => setEditData({ ...editData, bookings: e.target.value })}
                />
                <input className="w-full border rounded p-2" placeholder="Occupancy"
                  value={editData.occupancy} onChange={e => setEditData({ ...editData, occupancy: e.target.value })}
                />
                <input className="w-full border rounded p-2" placeholder="Revenue"
                  value={editData.revenue} onChange={e => setEditData({ ...editData, revenue: e.target.value })}
                />
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            ) : (
              <ul>
                <li>Bookings: {airbnb.bookings}</li>
                <li>Occupancy: {airbnb.occupancy}</li>
                <li>Revenue: {airbnb.revenue}</li>
              </ul>
            )
          ) : <p>Loading...</p>}
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

