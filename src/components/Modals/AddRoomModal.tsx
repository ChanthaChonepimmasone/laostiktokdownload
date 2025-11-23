import React, { useState } from 'react';
import { X, MapPin, Star, DollarSign, Home } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, lat, lng }) => {
  const { addRoom, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    price: '',
    rating: 5
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    const success = await addRoom({
      ...formData,
      price: parseFloat(formData.price),
      lat,
      lng,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, // Simple address for now
      user_id: currentUser.id,
      username: currentUser.username
    });

    setLoading(false);
    if (success) {
      onClose();
      setFormData({
        title: '',
        description: '',
        type: 'apartment',
        price: '',
        rating: 5
      });
    } else {
      alert('Failed to add room');
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-primary p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Home size={24} /> ເພີ່ມຫ້ອງເຊົ່າ
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark mb-1">ຊື່ຫ້ອງເຊົ່າ</label>
            <input 
              required
              type="text" 
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-colors"
              placeholder="ຕົວຢ່າງ: ຫ້ອງເຊົ່າລາຄາຖືກ..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-1">ປະເພດ</label>
              <select 
                className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="apartment">ອາພາດເມັ້ນ</option>
                <option value="condo">ຄອນໂດ</option>
                <option value="house">ເຮືອນ</option>
                <option value="dormitory">ຫໍພັກ</option>
                <option value="other">ອື່ນໆ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-1">ລາຄາ (ກີບ/ເດືອນ)</label>
              <div className="relative">
                <input 
                  required
                  type="number" 
                  className="w-full p-3 pl-10 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1">ລາຍລະອຽດ</label>
            <textarea 
              required
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none h-24 resize-none"
              placeholder="ລາຍລະອຽດເພີ່ມເຕີມ..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1">ຄະແນນ</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-warning' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-2 text-sm text-primary">
            <MapPin size={16} />
            <span>ຕຳແຫນ່ງ: {lat.toFixed(6)}, {lng.toFixed(6)}</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </button>
        </form>
      </div>
    </div>
  );
};
