
import React, { useState } from 'react';
import { User } from '../types';
import { api, RegistrationData } from '../services/api';
import { TrophyIcon, UserIcon, LockClosedIcon, UserGroupIcon, ArrowLeftIcon } from './common/Icons';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const InputField = ({ id, type, placeholder, value, onChange, icon, required = true }: { id: string, type: string, placeholder: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean }) => (
    <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </div>
        <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block"
        />
    </div>
);


export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration state
  const [regForm, setRegForm] = useState<Omit<RegistrationData, 'jumlahAnggota'> & { jumlahAnggota: string, confirmPassword: string }>({
    namaTim: '',
    asalSekolah: '',
    namaPelatih: '',
    jumlahAnggota: '',
    kontak: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setRegForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotification('');
    try {
        const user = await api.login(loginEmail, loginPassword);
        if (user) {
            onLogin(user);
        } else {
            setError('Email atau password salah.');
        }
    } catch (err) {
        setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');
    setNotification('');

    const registrationData: RegistrationData = {
        ...regForm,
        jumlahAnggota: parseInt(regForm.jumlahAnggota, 10) || 0,
    };

    try {
        await api.registerParticipant(registrationData);
        setNotification('Registrasi berhasil! Silakan login.');
        setView('login');
        setLoginEmail(regForm.email);
        setLoginPassword('');
        // Reset registration form
        setRegForm({ namaTim: '', asalSekolah: '', namaPelatih: '', jumlahAnggota: '', kontak: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-secondary p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <TrophyIcon className="w-20 h-20 text-brand-accent mx-auto"/>
            <h1 className="text-4xl font-bold text-white mt-4">Jember Marching Festival</h1>
            <h2 className="text-2xl font-semibold text-brand-accent">ke 9 tahun 2026</h2>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 transition-all duration-500 relative">
            <button 
                onClick={onBack} 
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-brand-light hover:bg-gray-200 text-brand-secondary transition-colors" 
                title="Kembali ke Portal"
            >
                <ArrowLeftIcon className="h-6 w-6"/>
            </button>
            {view === 'login' ? (
                <div>
                    <h3 className="text-2xl font-semibold text-center text-brand-primary mb-6">Login</h3>
                    <form onSubmit={handleLogin}>
                        {error && <p className="bg-red-100 text-red-700 p-2 rounded-md text-sm mb-4">{error}</p>}
                        {notification && <p className="bg-green-100 text-green-700 p-2 rounded-md text-sm mb-4">{notification}</p>}
                        <InputField id="email" type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} icon={<UserIcon className="h-5 w-5 text-gray-400"/>} />
                        <InputField id="password" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} icon={<LockClosedIcon className="h-5 w-5 text-gray-400"/>} />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-brand-accent hover:bg-yellow-500 text-brand-primary font-bold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Belum punya akun peserta?{' '}
                            <button type="button" onClick={() => { setView('register'); setError(''); setNotification(''); }} className="font-semibold text-brand-secondary hover:underline">
                                Registrasi di sini
                            </button>
                        </p>
                    </form>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-center text-brand-primary mb-6">Registrasi Peserta</h3>
                    <form onSubmit={handleRegister}>
                        {error && <p className="bg-red-100 text-red-700 p-2 rounded-md text-sm mb-4">{error}</p>}
                        <div className="max-h-80 overflow-y-auto pr-2 -mr-2">
                           <InputField id="namaTim" type="text" placeholder="Nama Tim" value={regForm.namaTim} onChange={handleRegFormChange} icon={<UserGroupIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="asalSekolah" type="text" placeholder="Asal Sekolah" value={regForm.asalSekolah} onChange={handleRegFormChange} icon={<UserGroupIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="namaPelatih" type="text" placeholder="Nama Pelatih" value={regForm.namaPelatih} onChange={handleRegFormChange} icon={<UserIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="jumlahAnggota" type="number" placeholder="Jumlah Anggota" value={regForm.jumlahAnggota} onChange={handleRegFormChange} icon={<UserGroupIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="kontak" type="text" placeholder="Kontak (No. HP)" value={regForm.kontak} onChange={handleRegFormChange} icon={<UserIcon className="h-5 w-5 text-gray-400"/>} />
                           <hr className="my-4"/>
                           <InputField id="email" type="email" placeholder="Email untuk Login" value={regForm.email} onChange={handleRegFormChange} icon={<UserIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="password" type="password" placeholder="Password" value={regForm.password} onChange={handleRegFormChange} icon={<LockClosedIcon className="h-5 w-5 text-gray-400"/>} />
                           <InputField id="confirmPassword" type="password" placeholder="Konfirmasi Password" value={regForm.confirmPassword} onChange={handleRegFormChange} icon={<LockClosedIcon className="h-5 w-5 text-gray-400"/>} />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-brand-accent hover:bg-yellow-500 text-brand-primary font-bold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                             {loading ? 'Mendaftar...' : 'Registrasi'}
                        </button>
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Sudah punya akun?{' '}
                            <button type="button" onClick={() => { setView('login'); setError(''); setNotification(''); }} className="font-semibold text-brand-secondary hover:underline">
                                Login di sini
                            </button>
                        </p>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
