import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockComplaints } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getMarkerColor = (status) => {
  switch(status) {
    case 'Pending': return 'red';
    case 'In Progress': return 'orange';
    case 'Under Inspection': return 'violet';
    case 'Assigned': return 'blue';
    case 'Resolved': return 'green';
    default: return 'grey';
  }
};

const MapPage = () => {
  const [filter, setFilter] = useState('All');
  
  const filteredComplaints = filter === 'All' 
    ? mockComplaints 
    : mockComplaints.filter(c => c.status === filter);

  const pendingCount = mockComplaints.filter(c => c.status === 'Pending').length;
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      {/* Filters & Stats Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-navy text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
            <select className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 outline-none hover:bg-gray-200 cursor-pointer">
              <option>Category</option>
              <option>Roads</option>
              <option>Water</option>
              <option>Garbage</option>
            </select>
          </div>
          
          <div className="flex gap-4 text-sm font-medium">
            <div className="px-3 py-1 bg-orange-50 text-saffron rounded-lg">
              Total shown: {filteredComplaints.length}
            </div>
            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hidden sm:block">
              Oldest pending: 3 days
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-gray-200 relative z-0">
        <MapContainer 
          center={[28.6139, 77.2090]} 
          zoom={12} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {filteredComplaints.map(complaint => (
            <Marker 
              key={complaint.id} 
              position={[complaint.lat, complaint.lng]}
              icon={customIcon(getMarkerColor(complaint.status))}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">
                    {complaint.category}
                  </div>
                  <h3 className="font-semibold text-navy text-base leading-tight mb-2">
                    {complaint.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin size={12} className="text-saffron" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <StatusBadge status={complaint.status} />
                    <span className="text-xs font-bold text-gray-400">
                      {complaint.upvotes} ⭐
                    </span>
                  </div>
                  <button className="w-full mt-3 bg-navy text-white text-xs font-semibold py-2 rounded pointer hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Bottom Stats Cards - Desktop */}
      <div className="absolute bottom-6 left-6 right-6 hidden md:grid grid-cols-3 gap-6 max-w-7xl mx-auto z-[400] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 pointer-events-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total in view</p>
          <p className="text-3xl font-black text-navy">{filteredComplaints.length}</p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-red-100 pointer-events-auto">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Oldest Pending</p>
          <p className="text-lg font-bold text-red-700 leading-tight">Garbage pile uncollected<br/><span className="text-sm font-medium opacity-80">Karol Bagh • 4 days seq</span></p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100 pointer-events-auto">
          <p className="text-xs font-bold text-saffron uppercase tracking-widest mb-1">Most Upvoted</p>
          <p className="text-lg font-bold text-gray-800 leading-tight">Open manhole<br/><span className="text-sm font-medium text-gray-500">Janakpuri • 210 upvotes</span></p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
