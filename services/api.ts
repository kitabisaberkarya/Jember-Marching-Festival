import { User, Role, Team, Score, Announcement, PastEvent, GalleryImage, Requirement } from '../types';

// This is the live backend URL for the Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1Qa8DHDy5rxYcn1x4QUzci4Z-uyDswy4kn7QokFTh_oeX2Es5PDIlQ_ZQ0duPMc6V/exec";

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
  // We have to use a workaround for POST with Google Apps Script from browser
  // A standard POST request might be blocked by CORS or require preflight which GAS doesn't handle well
  // We send it as a GET request with payload stringified in params
  const url = new URL(SCRIPT_URL);
  const postData = {
    method: 'POST',
    body: JSON.stringify({ action, payload }),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Use text/plain to avoid preflight
    },
  };
  
  const response = await fetch(url.toString(), postData);
   if (!response.ok) {
    throw new Error(`Network response was not ok for POST action: ${action}`);
  }
  return response.json();
};

export type RegistrationData = Omit<Team, 'teamId' | 'linkFotoTim'> & {
    email: string;
    password: string;
};

export interface LandingPageContent {
  pastEvents: PastEvent[];
  galleryImages: GalleryImage[];
  requirements: Requirement[];
}

export const api = {
  login: async (email: string, password: string): Promise<User | undefined> => {
    const result = await performPost('login', { email, password });
    if (result.success) {
      return result.user;
    }
    if (result.message) {
        throw new Error(result.message);
    }
    return undefined;
  },

  registerParticipant: async (data: RegistrationData): Promise<any> => {
    const result = await performPost('registerParticipant', data);
    if (!result.success) {
      throw new Error(result.message || "Registrasi gagal.");
    }
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

  // Fetches all content for the landing page in a single call
  getLandingPageContent: (): Promise<LandingPageContent> => performGet('getLandingPageContent'),
};