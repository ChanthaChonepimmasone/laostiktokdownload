import React, { useState } from 'react';
import { useAppStore, Room } from './store/useAppStore';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';
import { AddRoomModal } from './components/Modals/AddRoomModal';
import { RoomDetailModal } from './components/Modals/RoomDetailModal';
import { EditProfileModal } from './components/Modals/EditProfileModal';
import { Plus } from 'lucide-react';

function App() {
  const { currentUser, userLocation } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newRoomLocation, setNewRoomLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Fetch rooms on mount
  React.useEffect(() => {
    useAppStore.getState().fetchRooms();
  }, []);

  if (!currentUser) {
    return <Auth />;
  }

  const handleAddMarkerClick = () => {
    if (userLocation) {
      const useCurrent = window.confirm('ຕ້ອງການໃຊ້ຕຳແຫນ່ງປັດຈຸບັນຂອງທ່ານບໍ່?');
      if (useCurrent) {
        setNewRoomLocation(userLocation);
        setIsAddModalOpen(true);
        return;
      }
    }
    
    setIsAddingMode(true);
    alert('ກະລຸນາເລືອກຕຳແຫນ່ງໃນແຜນທີ່');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    if (isAddingMode) {
      setNewRoomLocation({ lat, lng });
      setIsAddingMode(false);
      setIsAddModalOpen(true);
    }
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsSidebarOpen(false); // Close sidebar on mobile to see map
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onOpenProfile={() => setIsSidebarOpen(true)}
      />

      <div className="flex-1 relative flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative z-0">
          <Map 
            selectedRoom={selectedRoom}
            isAddingMode={isAddingMode}
            onLocationSelect={handleLocationSelect}
            onUserLocationFound={(lat, lng) => {
              // Optional: Auto center or something
            }}
          />
          
          {/* Sidebar Toggle Button (Mobile) */}
          <button 
            className="absolute top-4 left-4 z-[400] bg-white p-3 rounded-xl shadow-lg md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="text-xl">≡</span>
          </button>

          {/* Add Button */}
          <div className="absolute bottom-24 md:bottom-8 right-4 flex flex-col gap-3 z-[400]">
            <button 
              onClick={handleAddMarkerClick}
              className={`p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform text-white ${isAddingMode ? 'bg-warning animate-pulse' : 'bg-success'}`}
              title="ເພີ່ມຫ້ອງເຊົ່າ"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onViewRoom={handleViewRoom}
          onShowDetail={(room) => {
            setSelectedRoom(room);
            setIsDetailModalOpen(true);
          }}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
        />
      </div>

      {/* Modals */}
      {newRoomLocation && (
        <AddRoomModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          lat={newRoomLocation.lat}
          lng={newRoomLocation.lng}
        />
      )}

      <RoomDetailModal 
        room={selectedRoom}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <EditProfileModal 
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />
    </div>
  );
}

export default App;
