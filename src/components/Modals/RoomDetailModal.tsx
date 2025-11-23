import React from 'react';
import { X, MapPin, Star, DollarSign, User, Calendar } from 'lucide-react';
import { Room } from '../../store/useAppStore';

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, isOpen, onClose }) => {
  if (!isOpen || !room) return null;

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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="relative h-48 bg-gray-200">
          <img 
            src={`https://source.unsplash.com/800x600/?room,${room.type}`} 
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80';
            }}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-primary shadow-sm">
            {getRoomTypeText(room.type)}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-dark">{room.title}</h2>
            <div className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-lg font-bold">
              <Star size={16} fill="currentColor" />
              {room.rating}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-6 text-sm">
            <MapPin size={16} />
            {room.address}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <DollarSign size={12} /> ລາຄາ
              </div>
              <div className="font-bold text-primary text-lg">
                {room.price.toLocaleString()} ₭
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <User size={12} /> ຜູ້ປະກາດ
              </div>
              <div className="font-bold text-green-600 text-lg truncate">
                {room.username}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-dark mb-2">ລາຍລະອຽດ</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {room.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(room.createdAt).toLocaleDateString('lo-LA')}
            </div>
            <button className="text-primary font-semibold hover:underline">
              ແຈ້ງບັນຫາ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
