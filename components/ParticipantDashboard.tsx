import React, { useState, useEffect, useMemo } from 'react';
import { User, Team, Score, Announcement } from '../types';
import { api } from '../services/api';
import { Card } from './common/Card';
import { JUDGING_CRITERIA } from '../constants';
import { TrophyIcon, UserGroupIcon, MegaphoneIcon } from './common/Icons';

interface ParticipantDashboardProps {
  user: User;
}

const ResultsPanel: React.FC<{ teamId: string }> = ({ teamId }) => {
    const [scores, setScores] = useState<Score[]>([]);
    const [judges, setJudges] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedScores, allUsers] = await Promise.all([
                api.getScoresByTeam(teamId),
                api.getAllUsers()
            ]);
            setScores(fetchedScores);
            setJudges(allUsers.filter(u => u.role === 'Juri'));
            setLoading(false);
        };
        fetchData();
    }, [teamId]);

    const resultsByCriteria = useMemo(() => {
        const grouped: { [key: string]: { scores: { juri: User | undefined, nilai: number }[], avg: number } } = {};
        
        JUDGING_CRITERIA.forEach(criteria => {
            const criteriaScores = scores.filter(s => s.kriteria === criteria);
            const scoresWithJuri = criteriaScores.map(s => ({
                juri: judges.find(j => j.email === s.juriEmail),
                nilai: s.nilai
            }));
            const total = scoresWithJuri.reduce((sum, s) => sum + s.nilai, 0);
            const avg = scoresWithJuri.length > 0 ? total / scoresWithJuri.length : 0;
            
            grouped[criteria] = { scores: scoresWithJuri, avg };
        });

        return grouped;
    }, [scores, judges]);

    const comments = useMemo(() => {
        return scores
            .filter(s => s.komentar)
            .map(s => ({...s, juri: judges.find(j => j.email === s.juriEmail)}))
    }, [scores, judges]);

    if (loading) return <div className="text-center p-8">Loading results...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-brand-primary mb-4">Detail Skor</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="hidden md:grid md:grid-cols-[1fr,repeat(3,auto),1fr] gap-4 p-4 bg-gray-100 font-bold text-brand-primary border-b">
                        <div>Kriteria</div>
                        {judges.map(j => <div key={j.email} className="text-center">{j.fullName}</div>)}
                        <div className="text-right">Rata-rata</div>
                    </div>
                    {JUDGING_CRITERIA.map(criteria => (
                        <div key={criteria} className="md:grid md:grid-cols-[1fr,repeat(3,auto),1fr] gap-4 p-4 border-b last:border-b-0">
                            <div className="font-semibold text-brand-secondary mb-2 md:mb-0">{criteria}</div>
                            {judges.map(juri => {
                                const score = resultsByCriteria[criteria]?.scores.find(s => s.juri?.email === juri.email);
                                return <div key={juri.email} className="text-center text-gray-700">{score ? score.nilai.toFixed(2) : '-'}</div>;
                            })}
                            <div className="text-right font-bold text-brand-primary mt-2 md:mt-0">{resultsByCriteria[criteria]?.avg.toFixed(2) ?? 'N/A'}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-semibold text-brand-primary mb-4">Komentar Juri</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    {comments.map(comment => (
                        <Card key={comment.scoreId} className="bg-yellow-50">
                             <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-bold text-xl">
                                    {comment.juri?.fullName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-brand-primary">{comment.juri?.fullName}</p>
                                    <p className="text-sm text-gray-500 mb-2">{comment.kriteria}</p>
                                    <p className="text-gray-700">"{comment.komentar}"</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ user }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [judges, setJudges] = useState<User[]>([]);
  const [resultsPublished, setResultsPublished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user.teamId) {
        const [
          fetchedTeam, 
          fetchedAnnouncements, 
          fetchedTeams, 
          allUsers,
          status
        ] = await Promise.all([
          api.getTeamById(user.teamId),
          api.getAnnouncements(),
          api.getTeams(),
          api.getAllUsers(),
          api.getResultsStatus()
        ]);

        setTeam(fetchedTeam || null);
        setAnnouncements(fetchedAnnouncements);
        setAllTeams(fetchedTeams);
        setJudges(allUsers.filter(u => u.role === 'Juri'));
        setResultsPublished(status);
      }
    };
    fetchData();
  }, [user]);
  
  if (!team) return <div className="p-8 text-center">Loading team data...</div>;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-brand-primary">Selamat Datang, {team.namaTim}!</h1>
        <p className="text-lg text-brand-secondary">Inilah dashboard kejuaraan Anda.</p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Profil Tim" icon={<UserGroupIcon className="h-6 w-6 text-brand-accent" />} className="md:col-span-1">
          <img src={team.linkFotoTim} alt={team.namaTim} className="w-full h-48 object-cover rounded-md mb-4" />
          <h4 className="text-xl font-bold text-brand-primary">{team.namaTim}</h4>
          <p className="text-gray-600">{team.asalSekolah}</p>
          <div className="mt-4 text-sm space-y-2">
            <p><strong>Pelatih:</strong> {team.namaPelatih}</p>
            <p><strong>Jumlah Anggota:</strong> {team.jumlahAnggota}</p>
          </div>
        </Card>
        
        <div className="md:col-span-2 space-y-6">
            <Card title="Pengumuman" icon={<MegaphoneIcon className="h-6 w-6 text-brand-accent"/>}>
                <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {announcements.map(ann => (
                        <li key={ann.id} className="border-b pb-2 last:border-0 last:pb-0">
                            <p className="text-gray-800">{ann.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(ann.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card title="Dewan Juri" icon={<TrophyIcon className="h-6 w-6 text-brand-accent"/>}>
                <div className="flex flex-wrap gap-4">
                    {judges.map(juri => (
                        <div key={juri.email} className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
                           <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold">
                                {juri.fullName.charAt(0)}
                            </div>
                           <span className="font-semibold text-brand-secondary">{juri.fullName}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
      
      <Card title="Hasil Penilaian" icon={<TrophyIcon className="h-6 w-6 text-brand-accent" />}>
        {resultsPublished ? (
          <ResultsPanel teamId={team.teamId} />
        ) : (
          <div className="text-center py-10">
            <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-primary">Hasil Penilaian Belum Dirilis</h3>
            <p className="text-gray-500 mt-2">Mohon tunggu pengumuman resmi dari panitia. Tetap semangat!</p>
          </div>
        )}
      </Card>
    </div>
  );
};