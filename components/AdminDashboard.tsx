import React, { useState, useEffect } from 'react';
import { User, Announcement } from '../types';
import { api } from '../services/api';
import { Card } from './common/Card';
import { MegaphoneIcon, TrophyIcon } from './common/Icons';
import { RecapTable } from './RecapTable';

export const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [resultsPublished, setResultsPublished] = useState(false);
    const [isTogglingResults, setIsTogglingResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [fetchedAnnouncements, status] = await Promise.all([
                api.getAnnouncements(),
                api.getResultsStatus()
            ]);
            setAnnouncements(fetchedAnnouncements);
            setResultsPublished(status);
        };
        fetchData();
    }, []);

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;
        
        setIsPosting(true);
        const posted = await api.postAnnouncement(newAnnouncement);
        setAnnouncements([posted, ...announcements]);
        setNewAnnouncement('');
        setIsPosting(false);
    };

    const handleToggleResults = async () => {
        setIsTogglingResults(true);
        const newStatus = await api.setResultsStatus(!resultsPublished);
        setResultsPublished(newStatus);
        setIsTogglingResults(false);
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-brand-primary">Dashboard Admin</h1>
                <p className="text-lg text-brand-secondary">Selamat datang, {user.fullName}.</p>
            </header>
            
            <div className="grid md:grid-cols-2 gap-8">
                <Card title="Manajemen Pengumuman" icon={<MegaphoneIcon className="h-6 w-6 text-brand-accent"/>}>
                    <form onSubmit={handlePostAnnouncement} className="mb-6">
                        <h4 className="font-semibold text-brand-secondary mb-2">Buat Pengumuman Baru</h4>
                        <textarea
                            rows={4}
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-brand-secondary focus:border-brand-secondary"
                            placeholder="Tulis pengumuman di sini..."
                        />
                        <button
                            type="submit"
                            disabled={isPosting}
                            className="mt-2 w-full bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                        >
                            {isPosting ? 'Mengirim...' : 'Kirim Pengumuman'}
                        </button>
                    </form>
                    
                    <div>
                        <h4 className="font-semibold text-brand-secondary mb-3">Riwayat Pengumuman</h4>
                        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {announcements.map(ann => (
                                <li key={ann.id} className="bg-gray-100 p-3 rounded-md">
                                    <p className="text-gray-800 text-sm">{ann.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(ann.timestamp).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>

                <Card title="Manajemen Hasil Lomba" icon={<TrophyIcon className="h-6 w-6 text-brand-accent"/>}>
                    <div className="text-center p-6">
                        <p className="text-lg text-brand-primary mb-2">Status Hasil Penilaian Saat Ini:</p>
                        <span className={`px-4 py-1 text-sm font-bold rounded-full ${resultsPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {resultsPublished ? 'SUDAH DIPUBLIKASIKAN' : 'BELUM DIPUBLIKASIKAN'}
                        </span>
                        
                        <p className="text-sm text-gray-500 mt-6 mb-4">
                            {resultsPublished 
                                ? 'Peserta dapat melihat hasil penilaian. Klik untuk menyembunyikan kembali.' 
                                : 'Peserta belum dapat melihat hasil. Klik untuk mempublikasikan.'
                            }
                        </p>

                        <button
                            onClick={handleToggleResults}
                            disabled={isTogglingResults}
                            className={`w-full font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 ${
                                resultsPublished
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {isTogglingResults ? 'Memproses...' : (resultsPublished ? 'Sembunyikan Hasil' : 'Publikasikan Hasil')}
                        </button>
                    </div>
                </Card>
            </div>

            <Card title="Rekapitulasi Hasil Lomba" icon={<TrophyIcon className="h-6 w-6 text-brand-accent"/>}>
                <RecapTable />
            </Card>
        </div>
    );
};