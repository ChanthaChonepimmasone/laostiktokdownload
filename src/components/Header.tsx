import React from 'react';
import { User, LogOut, Home } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const { currentUser, logout } = useAppStore();

  return (
    <header className="bg-gradient-to-r from-laos-blue to-primary text-white p-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-laos-red via-white to-laos-red"></div>
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-primary text-xl shadow-md">
            🏠
          </div>
          <span>Room Finder</span>
        </div>
        
        <div className="flex gap-3">
          {currentUser && (
            <>
              <button 
                onClick={onOpenProfile}
                className="bg-white/20 hover:bg-white/30 text-white w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:-translate-y-0.5"
                title="ໂປຣຟາຍ"
              >
                <User size={20} />
              </button>
              <button 
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 text-white w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:-translate-y-0.5"
                title="ອອກຈາກລະບົບ"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
