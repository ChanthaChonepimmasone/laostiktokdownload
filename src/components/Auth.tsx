import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Key, User as UserIcon } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, register } = useAppStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup State
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupBio, setSignupBio] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login({ email: loginEmail, password: loginPassword });
    setIsLoading(false);
    if (!success) {
      alert('ອີເມວຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register({
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      bio: signupBio
    });
    setIsLoading(false);
    if (!success) {
      alert('ການລົງທະບຽນຜິດພາດ (ຊື່ຜູ້ໃຊ້ຫຼືອີເມວອາດຈະມີຢູ່ແລ້ວ)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-blue-50 flex flex-col">
      <header className="bg-gradient-to-r from-laos-blue to-primary text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xl font-bold">
          <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-primary text-xl shadow-md">
            🚽
          </div>
          <span>Khee - ຫ້ອງນ້ຳໃກ້ຕົວທ່ານ</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button 
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'login' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('login')}
            >
              ເຂົ້າສູ່ລະບົບ
            </button>
            <button 
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'signup' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('signup')}
            >
              ລົງທະບຽນ
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-primary mb-6">ເຂົ້າສູ່ລະບົບ Khee</h2>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ອີເມວ</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="ອີເມວຂອງທ່ານ"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ລະຫັດຜ່ານ</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="ລະຫັດຜ່ານ"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'ກະລຸນາລໍຖ້າ...' : <><Key size={20} /> ເຂົ້າສູ່ລະບົບ</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-primary mb-6">ລົງທະບຽນ Khee</h2>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ຊື່ຜູ້ໃຊ້</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="ຊື່ຜູ້ໃຊ້ທີ່ຕ້ອງການ"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ຂໍ້ມູນກ່ຽວກັບທ່ານ</label>
                <textarea 
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                  placeholder="ບອກກ່ຽວກັບຕົວທ່ານ..."
                  value={signupBio}
                  onChange={(e) => setSignupBio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ອີເມວ</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="ອີເມວຂອງທ່ານ"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">ລະຫັດຜ່ານ</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="ລະຫັດຜ່ານ"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'ກະລຸນາລໍຖ້າ...' : <><UserIcon size={20} /> ລົງທະບຽນ</>}
              </button>
            </form>
          )}

          <div className="mt-6 p-4 bg-green-50 rounded-2xl text-center text-sm text-green-800 border border-green-200">
            <strong>Online Mode:</strong> ຂໍ້ມູນຂອງທ່ານຈະຖືກບັນທຶກໃນ Cloud Database ຢ່າງປອດໄພ
          </div>
        </div>
      </div>
    </div>
  );
};
