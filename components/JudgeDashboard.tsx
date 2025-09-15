
import React, { useState, useEffect } from 'react';
import { User, Team, Score } from '../types';
import { api } from '../services/api';
import { JUDGING_CRITERIA } from '../constants';
import { Card } from './common/Card';
import { PencilIcon, ChevronDownIcon } from './common/Icons';

interface ScoreInput {
    kriteria: string;
    nilai: number;
    komentar: string;
}

export const JudgeDashboard: React.FC<{ user: User }> = ({ user }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [scores, setScores] = useState<ScoreInput[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        api.getTeams().then(fetchedTeams => {
            setTeams(fetchedTeams);
            if (fetchedTeams.length > 0) {
                setSelectedTeamId(fetchedTeams[0].teamId);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedTeamId) {
            setScores(JUDGING_CRITERIA.map(kriteria => ({ kriteria, nilai: 50, komentar: '' })));
        }
    }, [selectedTeamId]);

    const handleScoreChange = (kriteria: string, nilai: number) => {
        setScores(currentScores =>
            currentScores.map(s => s.kriteria === kriteria ? { ...s, nilai } : s)
        );
    };

    const handleCommentChange = (kriteria: string, komentar: string) => {
        setScores(currentScores =>
            currentScores.map(s => s.kriteria === kriteria ? { ...s, komentar } : s)
        );
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeamId) return;

        setIsSubmitting(true);
        setSubmissionStatus('idle');

        const scoresToSubmit = scores.map(s => ({
            ...s,
            teamId: selectedTeamId,
            juriEmail: user.email,
        }));

        try {
            await api.submitScores(scoresToSubmit);
            setSubmissionStatus('success');
            setTimeout(() => setSubmissionStatus('idle'), 3000);
        } catch (error) {
            setSubmissionStatus('error');
            setTimeout(() => setSubmissionStatus('idle'), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-brand-primary">Formulir Penilaian Juri</h1>
                <p className="text-lg text-brand-secondary">Selamat bertugas, {user.fullName}.</p>
            </header>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="team-select" className="block text-lg font-medium text-brand-primary mb-2">
                            Pilih Tim untuk Dinilai
                        </label>
                        <div className="relative">
                            <select
                                id="team-select"
                                value={selectedTeamId}
                                onChange={(e) => setSelectedTeamId(e.target.value)}
                                className="w-full md:w-1/2 appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block p-3"
                            >
                                {teams.map(team => (
                                    <option key={team.teamId} value={team.teamId}>
                                        {team.namaTim} - {team.asalSekolah}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 md:right-1/2 flex items-center px-3 text-gray-700">
                                <ChevronDownIcon className="h-5 w-5"/>
                            </div>
                        </div>
                    </div>

                    {selectedTeamId && (
                        <div className="space-y-8">
                            {scores.map(({ kriteria, nilai, komentar }) => (
                                <div key={kriteria} className="border-t pt-6 first:border-t-0 first:pt-0">
                                    <h4 className="text-xl font-semibold text-brand-secondary mb-3">{kriteria}</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor={`score-${kriteria}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Nilai: <span className="font-bold text-brand-primary text-lg">{nilai}</span>
                                            </label>
                                            <input
                                                id={`score-${kriteria}`}
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={nilai}
                                                onChange={(e) => handleScoreChange(kriteria, parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`comment-${kriteria}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Komentar (Opsional)
                                            </label>
                                            <textarea
                                                id={`comment-${kriteria}`}
                                                rows={2}
                                                value={komentar}
                                                onChange={(e) => handleCommentChange(kriteria, e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-brand-secondary focus:border-brand-secondary"
                                                placeholder="Berikan masukan yang membangun..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-6 border-t flex items-center justify-end space-x-4">
                                {submissionStatus === 'success' && <p className="text-green-600">Penilaian berhasil dikirim!</p>}
                                {submissionStatus === 'error' && <p className="text-red-600">Gagal mengirim. Coba lagi.</p>}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center bg-brand-accent hover:bg-yellow-500 text-brand-primary font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PencilIcon className="h-5 w-5 mr-2" />
                                    {isSubmitting ? 'Mengirim...' : 'Kirim Penilaian'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
};
