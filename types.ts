
export enum Role {
  Participant = "Peserta",
  Judge = "Juri",
  Admin = "Admin",
}

export interface User {
  email: string;
  role: Role;
  teamId?: string;
  fullName: string;
}

export interface Team {
  teamId: string;
  namaTim: string;
  asalSekolah: string;
  namaPelatih: string;
  jumlahAnggota: number;
  kontak: string;
  linkFotoTim: string;
}

export interface Score {
  scoreId: string;
  teamId: string;
  juriEmail: string;
  kriteria: string;
  nilai: number;
  komentar: string;
  timestamp: string;
}

export interface Announcement {
    id: string;
    text: string;
    timestamp: string;
}

export interface PastEvent {
  year: number;
  theme: string;
  winner: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface Requirement {
  id: string;
  text: string;
}
