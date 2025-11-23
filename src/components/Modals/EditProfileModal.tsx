import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAppStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setBio(currentUser.bio || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await updateProfile({
      username,
      email,
      bio,
      ...(password ? { password } : {})
    });
    setIsLoading(false);
    
    if (success) {
      onClose();
    } else {
      alert('ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-primary">ແກ້ໄຂໂປຣຟາຍ</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">ຊື່ຜູ້ໃຊ້ *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">ຂໍ້ມູນກ່ຽວກັບທ່ານ</label>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none h-24 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">ອີເມວ *</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">ລະຫັດຜ່ານໃຫມ່ (ວ່າງໄວ້ຖ້າບໍ່ຕ້ອງການປ່ຽນ)</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none"
              placeholder="ລະຫັດຜ່ານໃຫມ່"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-success text-white py-4 rounded-xl font-bold shadow-lg shadow-success/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {isLoading ? 'ກຳລັງບັນທຶກ...' : <><Save size={20} /> ບັນທຶກການປ່ຽນແປງ</>}
          </button>
        </form>
      </div>
    </div>
  );
};
