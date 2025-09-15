import { User, Role, Team, Score, Announcement, PastEvent, GalleryImage, Requirement } from '../types';

// This is the live backend URL for the Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwmMapONTjLZjnJJOCnzckGGXFxygP4GCN5MrkIGAW3gpDXNyB297pi_-d3HFg8bZF4/exec";

// --- LIVE API FUNCTIONS ---

// Helper for GET requests
const performGet = async (action: string, params: Record<string, string> = {}) => {
  const url = new URL(SCRIPT_URL);
  url.searchParams.append('action', action);
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Network response was not ok for action: ${action}`);
  }
  return response.json();
};

// Helper for POST requests
const performPost = async (action: string, payload: object) => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });
  if (!response.ok) {
    throw new Error(`Network response was not ok for POST action: ${action}`);
  }
  return response.json();
};

export type RegistrationData = Omit<Team, 'teamId' | 'linkFotoTim'> & {
    email: string;
    password: string;
};

export const api = {
  login: async (email: string, password: string): Promise<User | undefined> => {
    const result = await performPost('login', { email, password });
    if (result.success) {
      return result.user;
    }
    // In case of login failure, the script might send a message
    if (result.message) {
        console.error(result.message);
    }
    return undefined;
  },

  registerParticipant: async (data: RegistrationData): Promise<{ user: User; team: Team }> => {
    const result = await performPost('registerParticipant', data);
    if (!result.success) {
      throw new Error(result.message || "Registrasi gagal.");
    }
    // The Apps Script doesn't return the full user/team object on register,
    // so we return a success indicator. The component will handle redirection.
    return result;
  },

  getAllUsers: (): Promise<User[]> => performGet('getAllUsers'),
  
  getTeams: (): Promise<Team[]> => performGet('getTeams'),

  getTeamById: (teamId: string): Promise<Team | undefined> => performGet('getTeamById', { teamId }),

  getScoresByTeam: (teamId: string): Promise<Score[]> => performGet('getScoresByTeam', { teamId }),

  getAllScores: (): Promise<Score[]> => performGet('getAllScores'),

  submitScores: async (scores: Omit<Score, 'scoreId' | 'timestamp'>[]): Promise<any> => {
    const result = await performPost('submitScores', scores);
     if (!result.success) {
      throw new Error(result.message || "Gagal mengirimkan skor.");
    }
    return result;
  },

  getAnnouncements: (): Promise<Announcement[]> => performGet('getAnnouncements'),

  postAnnouncement: async (text: string): Promise<Announcement> => {
    const result = await performPost('postAnnouncement', { text });
    if (result.error) {
        throw new Error(result.error);
    }
    return result;
  },
  
  getResultsStatus: (): Promise<boolean> => performGet('getResultsStatus'),

  setResultsStatus: async (isPublished: boolean): Promise<boolean> => {
    const result = await performPost('setResultsStatus', { isPublished });
    return result;
  },

  // --- Landing Page Data (still using mock for now as it's static) ---
  // In a real scenario, this could also be fetched from a 'Content' sheet
  getPastEvents: async (): Promise<PastEvent[]> => {
    return [
      { year: 2025, theme: "Harmoni Nusantara", winner: "Gita Bahana", imageUrl: "https://picsum.photos/seed/2025/600/400" },
      { year: 2024, theme: "Melodi Kemenangan", winner: "Nada Juara", imageUrl: "https://picsum.photos/seed/2024/600/400" },
      { year: 2023, theme: "Ritme Perjuangan", winner: "Gema Suara", imageUrl: "https://picsum.photos/seed/2023/600/400" },
    ];
  },

  getGalleryImages: async (): Promise<GalleryImage[]> => {
    return [
      { id: "G01", imageUrl: "https://picsum.photos/seed/gallery1/600/400", caption: "Penampilan pembuka yang memukau." },
      { id: "G02", imageUrl: "https://picsum.photos/seed/gallery2/600/400", caption: "Kekompakan baris berbaris." },
      { id: "G03", imageUrl: "https://picsum.photos/seed/gallery3/600/400", caption: "Momen perayaan juara." },
      { id: "G04", imageUrl: "https://picsum.photos/seed/gallery4/600/400", caption: "Aksi solo terompet yang energik." },
      { id: "G05", imageUrl: "https://picsum.photos/seed/gallery5/600/400", caption: "Formasi visual yang kompleks." },
      { id: "G06", imageUrl: "https://picsum.photos/seed/gallery6/600/400", caption: "Semangat para peserta di belakang panggung." },
    ];
  },

  getCompetitionRequirements: async (): Promise<Requirement[]> => {
    return [
      { id: "R01", text: "Setiap tim terdiri dari minimal 40 dan maksimal 60 anggota." },
      { id: "R02", text: "Durasi penampilan adalah 10-12 menit, termasuk masuk dan keluar area." },
      { id: "R03", text: "Setiap tim wajib membawakan satu lagu daerah sebagai bagian dari repertoar." },
      { id: "R04", text: "Pendaftaran ulang dan technical meeting wajib dihadiri oleh pelatih atau perwakilan tim." },
      { id: "R05", text: "Kostum dan properti tidak boleh mengandung unsur SARA atau politik." },
    ];
  }
};
