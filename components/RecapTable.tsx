import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Role, Score, Team, User } from '../types';
import { FileExcelIcon, FilePdfIcon, TrophyIcon } from './common/Icons';

// This is needed to extend the global Window object for the jsPDF and XLSX libraries
declare global {
    interface Window {
        jspdf: any;
        XLSX: any;
    }
}

interface RecapData {
    rank: number;
    teamId: string;
    teamName: string;
    asalSekolah: string;
    scoresByJudge: { [juriEmail: string]: number };
    totalScore: number;
}

const Medal: React.FC<{ rank: number }> = ({ rank }) => {
    if (rank > 3) return null;
    const colors = {
        1: 'text-yellow-400',
        2: 'text-gray-400',
        3: 'text-yellow-600',
    };
    return <TrophyIcon className={`h-5 w-5 inline-block mr-2 ${colors[rank]}`} />;
};

export const RecapTable: React.FC = () => {
    const [recapData, setRecapData] = useState<RecapData[]>([]);
    const [judges, setJudges] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [teams, scores, users] = await Promise.all([
                api.getTeams(),
                api.getAllScores(),
                api.getAllUsers(),
            ]);

            const activeJudges = users.filter(u => u.role === Role.Judge);
            setJudges(activeJudges);

            const calculatedData = teams.map(team => {
                const teamScores = scores.filter(s => s.teamId === team.teamId);
                const scoresByJudge: { [juriEmail: string]: number } = {};
                
                activeJudges.forEach(judge => {
                    const judgeScores = teamScores.filter(s => s.juriEmail === judge.email);
                    const totalForJudge = judgeScores.reduce((sum, score) => sum + score.nilai, 0);
                    scoresByJudge[judge.email] = totalForJudge;
                });

                const totalScore = Object.values(scoresByJudge).reduce((sum, score) => sum + score, 0);

                return {
                    teamId: team.teamId,
                    teamName: team.namaTim,
                    asalSekolah: team.asalSekolah,
                    scoresByJudge,
                    totalScore,
                };
            });

            const sortedData = calculatedData
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((data, index) => ({ ...data, rank: index + 1 }));

            setRecapData(sortedData);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleExportPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Rekapitulasi Hasil Lomba - Jember Marching Festival 2026", 14, 15);

        const tableColumn = ["Rank", "Nama Tim", "Asal Sekolah", ...judges.map(j => j.fullName), "Total Skor"];
        const tableRows: (string | number)[][] = [];

        recapData.forEach(data => {
            const rowData = [
                data.rank,
                data.teamName,
                data.asalSekolah,
                ...judges.map(j => data.scoresByJudge[j.email]?.toFixed(2) ?? '0.00'),
                data.totalScore.toFixed(2),
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("rekapitulasi-jmf-2026.pdf");
    };

    const handleExportExcel = () => {
        const worksheetData = recapData.map(data => {
            const row: { [key: string]: string | number } = {
                'Rank': data.rank,
                'Nama Tim': data.teamName,
                'Asal Sekolah': data.asalSekolah,
            };
            judges.forEach(j => {
                row[j.fullName] = data.scoresByJudge[j.email]?.toFixed(2) ?? '0.00';
            });
            row['Total Skor'] = data.totalScore.toFixed(2);
            return row;
        });

        const ws = window.XLSX.utils.json_to_sheet(worksheetData);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "Rekapitulasi");
        window.XLSX.writeFile(wb, "rekapitulasi-jmf-2026.xlsx");
    };


    if (loading) {
        return <div className="text-center p-8">Memuat rekapitulasi...</div>;
    }

    return (
        <div>
            <div className="flex justify-end space-x-4 mb-4">
                <button 
                    onClick={handleExportPDF}
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                   <FilePdfIcon className="h-5 w-5 mr-2" /> Download PDF
                </button>
                <button
                    onClick={handleExportExcel}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                   <FileExcelIcon className="h-5 w-5 mr-2" /> Download Excel
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-brand-secondary text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Nama Tim</th>
                            <th className="py-3 px-4 text-left hidden md:table-cell">Asal Sekolah</th>
                            {judges.map(j => <th key={j.email} className="py-3 px-4 text-right">{j.fullName}</th>)}
                            <th className="py-3 px-4 text-right">Total Skor</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {recapData.map((data, index) => (
                            <tr key={data.teamId} className={`border-b ${index < 3 ? 'font-semibold' : ''} ${data.rank === 1 ? 'bg-yellow-50' : data.rank === 2 ? 'bg-gray-100' : data.rank === 3 ? 'bg-yellow-50' : ''}`}>
                                <td className="py-3 px-4"><Medal rank={data.rank} />{data.rank}</td>
                                <td className="py-3 px-4">{data.teamName}</td>
                                <td className="py-3 px-4 hidden md:table-cell">{data.asalSekolah}</td>
                                {judges.map(j => (
                                    <td key={j.email} className="py-3 px-4 text-right">
                                        {data.scoresByJudge[j.email]?.toFixed(2) ?? '-'}
                                    </td>
                                ))}
                                <td className="py-3 px-4 text-right font-bold text-brand-primary">
                                    {data.totalScore.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};