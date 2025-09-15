import { User, Role, Team, Score, Announcement, PastEvent, GalleryImage, Requirement } from '../types';

// --- MOCK DATABASE ---

// Add password to internal user representation
const mockUsers = [
  // Participants
  { email: "peserta1@gmail.com", role: Role.Participant, teamId: "MB001", fullName: "Tim Gema Suara", password: "password123" },
  { email: "peserta2@gmail.com", role: Role.Participant, teamId: "MB002", fullName: "Tim Nada Juara", password: "password123" },
  { email: "peserta3@gmail.com", role: Role.Participant, teamId: "MB003", fullName: "Tim Genta Buana", password: "password123" },
  { email: "peserta4@gmail.com", role: Role.Participant, teamId: "MB004", fullName: "Tim Gita Harmoni", password: "password123" },
  { email: "peserta5@gmail.com", role: Role.Participant, teamId: "MB005", fullName: "Tim Swara Kencana", password: "password123" },
  
  // Judges
  { email: "juri1@gmail.com", role: Role.Judge, fullName: "Budi Santoso", password: "password123" },
  { email: "juri2@gmail.com", role: Role.Judge, fullName: "Citra Lestari", password: "password123" },
  { email: "juri3@gmail.com", role: Role.Judge, fullName: "Iwan Falsono", password: "password123" },
  { email: "juri4@gmail.com", role: Role.Judge, fullName: "Maya Estiantini", password: "password123" },

  // Admins
  { email: "admin@gmail.com", role: Role.Admin, fullName: "Admin Kejuaraan", password: "password123" },
  { email: "ketua@panitia.com", role: Role.Admin, fullName: "Ketua Panitia", password: "adminpass" },
  { email: "sekretaris@panitia.com", role: Role.Admin, fullName: "Sekretaris Lomba", password: "adminpass" },
];


let mockTeams: Team[] = [
  { teamId: "MB001", namaTim: "Gema Suara", asalSekolah: "SMA 1 Merdeka", namaPelatih: "Andi Wijaya", jumlahAnggota: 50, kontak: "08123456789", linkFotoTim: "https://picsum.photos/seed/MB001/400/300" },
  { teamId: "MB002", namaTim: "Nada Juara", asalSekolah: "SMA 2 Berkarya", namaPelatih: "Sari Putri", jumlahAnggota: 55, kontak: "08987654321", linkFotoTim: "https://picsum.photos/seed/MB002/400/300" },
  { teamId: "MB003", namaTim: "Genta Buana", asalSekolah: "SMK 3 Patriot", namaPelatih: "Rina Amelia", jumlahAnggota: 60, kontak: "081122334455", linkFotoTim: "https://picsum.photos/seed/MB003/400/300" },
  { teamId: "MB004", namaTim: "Gita Harmoni", asalSekolah: "MAN 1 Cendekia", namaPelatih: "Ahmad Zaki", jumlahAnggota: 48, kontak: "085566778899", linkFotoTim: "https://picsum.photos/seed/MB004/400/300" },
  { teamId: "MB005", namaTim: "Swara Kencana", asalSekolah: "SMA 5 Pelita", namaPelatih: "Dewi Anggraini", jumlahAnggota: 52, kontak: "087711223344", linkFotoTim: "https://picsum.photos/seed/MB005/400/300" },
];

let mockScores: Score[] = [
    { scoreId: "S001", teamId: "MB001", juriEmail: "juri1@gmail.com", kriteria: "Musikalitas - Melodi", nilai: 85, komentar: "Melodi sangat kuat dan jernih.", timestamp: new Date().toISOString() },
    { scoreId: "S002", teamId: "MB001", juriEmail: "juri1@gmail.com", kriteria: "Visual - Koreografi", nilai: 88, komentar: "Koreografi menarik dan sinkron.", timestamp: new Date().toISOString() },
    { scoreId: "S003", teamId: "MB001", juriEmail: "juri2@gmail.com", kriteria: "Musikalitas - Melodi", nilai: 90, komentar: "Eksekusi melodi yang luar biasa.", timestamp: new Date().toISOString() },
    // Add more scores for other teams and judges to make recap more interesting
    { scoreId: "S004", teamId: "MB002", juriEmail: "juri1@gmail.com", kriteria: "Musikalitas - Melodi", nilai: 92, komentar: "", timestamp: new Date().toISOString() },
    { scoreId: "S005", teamId: "MB002", juriEmail: "juri2@gmail.com", kriteria: "Musikalitas - Melodi", nilai: 91, komentar: "", timestamp: new Date().toISOString() },
    { scoreId: "S006", teamId: "MB002", juriEmail: "juri3@gmail.com", kriteria: "General Effect", nilai: 88, komentar: "", timestamp: new Date().toISOString() },
    { scoreId: "S007", teamId: "MB003", juriEmail: "juri1@gmail.com", kriteria: "Visual - Baris Berbaris", nilai: 80, komentar: "", timestamp: new Date().toISOString() },
    { scoreId: "S008", teamId: "MB003", juriEmail: "juri2@gmail.com", kriteria: "Visual - Baris Berbaris", nilai: 82, komentar: "", timestamp: new Date().toISOString() },
];

let mockAnnouncements: Announcement[] = [
    { id: "A001", text: "Selamat datang di Jember Marching Festival ke 9 tahun 2026! Jadwal teknis akan segera diumumkan.", timestamp: new Date().toISOString() }
];

const mockPastEvents: PastEvent[] = [
    { year: 2025, theme: "Harmoni Nusantara", winner: "Gita Bahana", imageUrl: "https://picsum.photos/seed/2025/600/400" },
    { year: 2024, theme: "Melodi Kemenangan", winner: "Nada Juara", imageUrl: "https://picsum.photos/seed/2024/600/400" },
    { year: 2023, theme: "Ritme Perjuangan", winner: "Gema Suara", imageUrl: "https://picsum.photos/seed/2023/600/400" },
];

const mockGalleryImages: GalleryImage[] = [
    { id: "G01", imageUrl: "https://picsum.photos/seed/gallery1/600/400", caption: "Penampilan pembuka yang memukau." },
    { id: "G02", imageUrl: "https://picsum.photos/seed/gallery2/600/400", caption: "Kekompakan baris berbaris." },
    { id: "G03", imageUrl: "https://picsum.photos/seed/gallery3/600/400", caption: "Momen perayaan juara." },
    { id: "G04", imageUrl: "https://picsum.photos/seed/gallery4/600/400", caption: "Aksi solo terompet yang energik." },
    { id: "G05", imageUrl: "https://picsum.photos/seed/gallery5/600/400", caption: "Formasi visual yang kompleks." },
    { id: "G06", imageUrl: "https://picsum.photos/seed/gallery6/600/400", caption: "Semangat para peserta di belakang panggung." },
];

const mockRequirements: Requirement[] = [
    { id: "R01", text: "Setiap tim terdiri dari minimal 40 dan maksimal 60 anggota." },
    { id: "R02", text: "Durasi penampilan adalah 10-12 menit, termasuk masuk dan keluar area." },
    { id: "R03", text: "Setiap tim wajib membawakan satu lagu daerah sebagai bagian dari repertoar." },
    { id: "R04", text: "Pendaftaran ulang dan technical meeting wajib dihadiri oleh pelatih atau perwakilan tim." },
    { id: "R05", text: "Kostum dan properti tidak boleh mengandung unsur SARA atau politik." },
];


let settings = {
    resultsPublished: false,
};

// --- SIMULATED API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Define registration data type internally
export type RegistrationData = Omit<Team, 'teamId' | 'linkFotoTim'> & {
    email: string;
    password: string;
};

export const api = {
  login: async (email: string, password: string): Promise<User | undefined> => {
    await delay(500);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      // Return user object without the password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  },

  registerParticipant: async (data: RegistrationData): Promise<{ user: User; team: Team }> => {
    await delay(1000);
    if (mockUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("Email sudah terdaftar.");
    }

    const newTeamId = `MB${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
    const newTeam: Team = {
      teamId: newTeamId,
      namaTim: data.namaTim,
      asalSekolah: data.asalSekolah,
      namaPelatih: data.namaPelatih,
      jumlahAnggota: data.jumlahAnggota,
      kontak: data.kontak,
      linkFotoTim: `https://picsum.photos/seed/${newTeamId}/400/300`,
    };
    mockTeams.push(newTeam);

    const newUser = {
      email: data.email,
      role: Role.Participant,
      teamId: newTeamId,
      fullName: data.namaTim, // Use team name as full name for simplicity
      password: data.password,
    };
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, team: newTeam };
  },

  getAllUsers: async (): Promise<User[]> => {
    await delay(200);
    return mockUsers.map(({ password, ...user }) => user);
  },
  
  getTeams: async (): Promise<Team[]> => {
    await delay(500);
    return mockTeams;
  },

  getTeamById: async (teamId: string): Promise<Team | undefined> => {
    await delay(300);
    return mockTeams.find(t => t.teamId === teamId);
  },

  getScoresByTeam: async (teamId: string): Promise<Score[]> => {
    await delay(700);
    return mockScores.filter(s => s.teamId === teamId);
  },

  getAllScores: async (): Promise<Score[]> => {
    await delay(700);
    return mockScores;
  },

  submitScores: async (scores: Omit<Score, 'scoreId' | 'timestamp'>[]): Promise<Score[]> => {
    await delay(1000);
    const newScores: Score[] = scores.map(s => ({
        ...s,
        scoreId: `S${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
    }));
    mockScores.push(...newScores);
    return newScores;
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
      await delay(400);
      return [...mockAnnouncements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  postAnnouncement: async (text: string): Promise<Announcement> => {
      await delay(800);
      const newAnnouncement: Announcement = {
          id: `A${Math.random().toString(36).substr(2, 9)}`,
          text,
          timestamp: new Date().toISOString()
      };
      mockAnnouncements.push(newAnnouncement);
      return newAnnouncement;
  },
  
  getResultsStatus: async (): Promise<boolean> => {
    await delay(100);
    return settings.resultsPublished;
  },

  setResultsStatus: async (isPublished: boolean): Promise<boolean> => {
    await delay(600);
    settings.resultsPublished = isPublished;
    return settings.resultsPublished;
  },

  // --- Landing Page Data ---
  getPastEvents: async (): Promise<PastEvent[]> => {
    await delay(300);
    return mockPastEvents;
  },

  getGalleryImages: async (): Promise<GalleryImage[]> => {
    await delay(400);
    return mockGalleryImages;
  },

  getCompetitionRequirements: async (): Promise<Requirement[]> => {
    await delay(200);
    return mockRequirements;
  }
};