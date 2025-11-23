import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore, Room } from '../store/useAppStore';
import { Navigation } from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  selectedRoom: Room | null;
  isAddingMode: boolean;
  onLocationSelect: (lat: number, lng: number) => void;
  onUserLocationFound: (lat: number, lng: number) => void;
}

// Component to handle map view updates
const MapController: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
};

// Component to handle map clicks
const MapEvents: React.FC<{ onLocationSelect: (lat: number, lng: number) => void, isAddingMode: boolean }> = ({ onLocationSelect, isAddingMode }) => {
  useMapEvents({
    click(e) {
      if (isAddingMode) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const Map: React.FC<MapProps> = ({ 
  selectedRoom, 
  isAddingMode, 
  onLocationSelect,
  onUserLocationFound
}) => {
  const { rooms, userLocation, setUserLocation } = useAppStore();
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  const getRoomColor = (type: string) => {
    const colors: Record<string, string> = {
      'apartment': '#4CAF50',
      'condo': '#2196F3',
      'house': '#FF9800',
      'dormitory': '#9C27B0',
      'other': '#607D8B'
    };
    return colors[type] || '#607D8B';
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🏠</div>`,
      className: 'room-marker',
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });
  };

  const userIcon = L.divIcon({
    className: 'current-location-marker',
    html: '<div style="background: #4A90E2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(74, 144, 226, 0.5);"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  const selectedIcon = L.divIcon({
    className: 'selected-room-marker',
    html: '<div style="background: #27AE60; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(39, 174, 96, 0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const handleLocateMe = (manual = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          onUserLocationFound(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
          if (manual) alert("ບໍ່ສາມາດເຂົ້າເຖິງຕຳແຫນ່ງປັດຈຸບັນໄດ້");
        }
      );
    } else {
      if (manual) alert("ເບຣາວເຊີບໍ່ຮອງຮັບການກຳນົດຕຳແຫນ່ງ");
    }
  };

  // Auto-locate on mount
  useEffect(() => {
    handleLocateMe(false);
  }, []);

  // Update selected position when user clicks map in adding mode
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={[17.9757, 102.6331]} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onLocationSelect={handleMapClick} isAddingMode={isAddingMode} />
        
        {selectedRoom && (
          <MapController center={[selectedRoom.lat, selectedRoom.lng]} />
        )}

        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>ຕຳແຫນ່ງປັດຈຸບັນຂອງທ່ານ</Popup>
            </Marker>
            <Circle center={[userLocation.lat, userLocation.lng]} radius={50} pathOptions={{ color: '#4A90E2', fillColor: '#4A90E2', fillOpacity: 0.1 }} />
            <MapController center={[userLocation.lat, userLocation.lng]} />
          </>
        )}

        {isAddingMode && selectedPosition && (
          <Marker position={selectedPosition} icon={selectedIcon}>
            <Popup>ຕຳແຫນ່ງທີ່ເລືອກ</Popup>
          </Marker>
        )}

        {rooms.map(room => (
          <Marker 
            key={room.id} 
            position={[room.lat, room.lng]}
            icon={createCustomIcon(getRoomColor(room.type))}
          >
            <Popup>
              <div className="min-w-[200px] font-sans">
                <h3 className="m-0 mb-2 text-dark font-bold text-lg">{room.title}</h3>
                <p className="m-1"><strong>ປະເພດ:</strong> {room.type}</p>
                <p className="m-1"><strong>ລາຄາ:</strong> {room.price.toLocaleString()} ₭</p>
                <p className="m-1 text-sm text-gray-600">{room.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-24 md:bottom-8 right-4 flex flex-col gap-3 z-[400]">
        <button 
          onClick={() => handleLocateMe(true)}
          className="bg-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform text-primary"
          title="ຕຳແຫນ່ງຂອງຂ້ອຍ"
        >
          <Navigation size={24} />
        </button>
      </div>
    </div>
  );
};
