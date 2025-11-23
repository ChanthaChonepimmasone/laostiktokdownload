import React, { useState } from 'react';
import { Search, Filter, MapPin, Info, Eye, DollarSign } from 'lucide-react';
import { useAppStore, Room } from '../store/useAppStore';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRoom: (room: Room) => void;
  onShowDetail: (room: Room) => void;
  onEditProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onViewRoom, 
  onShowDetail,
  onEditProfile 
}) => {
  const { rooms, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('0');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || room.type === filterType;
    // Simple price filter logic (e.g., max price) could be added here if needed
    // For now just keeping it simple or maybe filtering by max price if implemented

    return matchesSearch && matchesType;
  });

  const getRoomTypeText = (type: string) => {
    const types: Record<string, string> = {
      'apartment': 'ອາພາດເມັ້ນ',
      'condo': 'ຄອນໂດ',
      'house': 'ເຮືອນ',
      'dormitory': 'ຫໍພັກ',
      'other': 'ອື່ນໆ'
    };
    return types[type] || type;
  };

  return (
    <div className={clsx(
      "fixed md:relative z-[100] bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col",
      "w-full md:w-[400px] h-[60vh] md:h-full bottom-0 md:bottom-auto left-0 md:left-auto",
      "rounded-t-3xl md:rounded-none",
      isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:hidden"
    )}>
      <div className="p-6 overflow-y-auto flex-1">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold mr-4 shadow-lg shadow-primary/30">
              {currentUser?.username.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark">{currentUser?.username || 'Guest'}</h2>
              <p className="text-gray text-sm">{currentUser?.email || 'Please login'}</p>
            </div>
          </div>
          <div className="bg-light p-4 rounded-xl text-sm italic text-gray mb-4">
            {currentUser?.bio || 'ຍັງບໍ່ມີຂໍ້ມູນກ່ຽວກັບຜູ້ໃຊ້'}
          </div>
          <button 
            onClick={onEditProfile}
            className="w-full py-2 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <span>✏️</span> ແກ້ໄຂໂປຣຟາຍ
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl mb-6 border-l-4 border-primary">
          <h3 className="font-bold text-primary-dark mb-3 flex items-center gap-2">
            📋 ວິທີໃຊ້ງານ
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-dark/80">
            <li>ກົດປຸ່ມ <strong>📍</strong> ເພື່ອສະແດງຕຳແຫນ່ງປັດຈຸບັນ</li>
            <li>ກົດປຸ່ມ <strong>🏠 ເພີ່ມຫ້ອງເຊົ່າ</strong> ເພື່ອປັກຫມຸດ</li>
            <li>ກອກຂໍ້ມູນແລະລາຄາ</li>
            <li>ກົດ "ບັນທຶກ" ເພື່ອແບ່ງປັນ</li>
          </ol>
        </div>

        {/* Search & Filter */}
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Search size={20} /> ຄົ້ນຫາຫ້ອງເຊົ່າ
        </h3>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex">
          <input 
            type="text" 
            placeholder="ຄົ້ນຫາຊື່ຫຼືທີ່ຢູ່..." 
            className="flex-1 p-4 outline-none text-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-primary text-white px-6 hover:bg-primary-dark transition-colors">
            <Search size={20} />
          </button>
        </div>

        <div className="bg-light p-6 rounded-2xl mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">ປະເພດ</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">ທັງຫມົດ</option>
                <option value="apartment">ອາພາດເມັ້ນ</option>
                <option value="condo">ຄອນໂດ</option>
                <option value="house">ເຮືອນ</option>
                <option value="dormitory">ຫໍພັກ</option>
                <option value="other">ອື່ນໆ</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <h3 className="font-bold text-lg mb-4">🏠 ລາຍການຫ້ອງເຊົ່າ</h3>
        <div className="space-y-4">
          {filteredRooms.length === 0 ? (
            <p className="text-center text-gray py-8">ບໍ່ພົບຫ້ອງເຊົ່າທີ່ກົງກັບເງື່ອນໄຂ</p>
          ) : (
            filteredRooms.map(room => (
              <div 
                key={room.id}
                className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-primary hover:-translate-y-1 transition-transform cursor-pointer"
                onClick={() => onViewRoom(room)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-dark">{room.title}</h4>
                  <span className="flex items-center text-primary font-bold">
                    {room.price.toLocaleString()} ₭
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray mb-2">
                  <span>{getRoomTypeText(room.type)}</span>
                  <span>ໂດຍ: {room.username}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray mb-3">
                  <MapPin size={14} /> {room.address}
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    className="flex-1 py-2 px-3 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewRoom(room);
                    }}
                  >
                    <Eye size={16} /> ເບິ່ງໃນແຜນທີ່
                  </button>
                  <button 
                    className="flex-1 py-2 px-3 bg-gray/10 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray/20 transition-colors flex items-center justify-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDetail(room);
                    }}
                  >
                    <Info size={16} /> ລາຍລະອຽດ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
