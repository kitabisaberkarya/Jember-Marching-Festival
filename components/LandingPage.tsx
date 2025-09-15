import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PastEvent, GalleryImage, Requirement } from '../types';
import { Card } from './common/Card';
import { CalendarIcon, CameraIcon, ClipboardCheckIcon, TrophyIcon } from './common/Icons';
import { Modal } from './common/Modal';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const Section: React.FC<{id: string, title: string, icon: React.ReactNode, children: React.ReactNode}> = ({ id, title, icon, children }) => (
    <section id={id} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent text-brand-primary">
                    {icon}
                </div>
                <h2 className="mt-4 text-3xl font-bold text-brand-primary sm:text-4xl">{title}</h2>
            </div>
            {children}
        </div>
    </section>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
    const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        api.getPastEvents().then(setPastEvents);
        api.getGalleryImages().then(setGalleryImages);
        api.getCompetitionRequirements().then(setRequirements);
    }, []);

    return (
        <div className="bg-brand-light font-sans">
            {/* Header */}
            <header className="bg-brand-primary shadow-md sticky top-0 z-20">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <TrophyIcon className="h-10 w-10 text-brand-accent"/>
                            <span className="ml-3 text-white font-semibold text-2xl">JMF 2026</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                               <a href="#history" className="text-gray-300 hover:bg-brand-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium">History</a>
                               <a href="#gallery" className="text-gray-300 hover:bg-brand-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gallery</a>
                               <a href="#requirements" className="text-gray-300 hover:bg-brand-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium">Requirements</a>
                            </div>
                        </div>
                        <button 
                            onClick={onNavigateToLogin}
                            className="hidden md:block bg-brand-accent hover:bg-yellow-500 text-brand-primary font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Ikut Lomba
                        </button>
                    </div>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <div className="relative bg-brand-secondary text-white text-center py-20 md:py-32">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <div className="relative z-10">
                        <TrophyIcon className="w-24 h-24 text-brand-accent mx-auto"/>
                        <h1 className="text-4xl md:text-6xl font-bold mt-4">Jember Marching Festival</h1>
                        <p className="text-2xl md:text-3xl font-semibold text-brand-accent mt-2">ke 9 tahun 2026</p>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
                            Ajang bergengsi para insan marching band se-Indonesia untuk menunjukkan kreativitas, harmoni, dan semangat juara.
                        </p>
                        <button 
                             onClick={onNavigateToLogin}
                             className="mt-10 bg-brand-accent hover:bg-yellow-500 text-brand-primary font-bold text-lg py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                        >
                            Daftar & Login Sekarang
                        </button>
                    </div>
                </div>

                {/* History Section */}
                <Section id="history" title="Jejak Juara Dari Tahun ke Tahun" icon={<CalendarIcon className="w-6 h-6"/>}>
                    <div className="grid gap-8 md:grid-cols-3">
                        {pastEvents.map(event => (
                            <Card key={event.year} className="text-center transition-transform transform hover:-translate-y-2">
                                <img src={event.imageUrl} alt={`Event ${event.year}`} className="w-full h-48 object-cover rounded-t-lg"/>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-brand-primary">{event.year}</h3>
                                    <p className="text-md text-brand-secondary italic mt-1">"{event.theme}"</p>
                                    <p className="mt-4 text-sm text-gray-500">Juara Umum</p>
                                    <p className="font-semibold text-brand-accent text-lg">{event.winner}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>
                
                {/* Gallery Section */}
                <div className="bg-white">
                    <Section id="gallery" title="Dokumentasi Lomba" icon={<CameraIcon className="w-6 h-6"/>}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.map(image => (
                                <div 
                                    key={image.id} 
                                    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img src={image.imageUrl} alt={image.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                                        <p className="text-white p-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Requirements Section */}
                <Section id="requirements" title="Syarat & Ketentuan Lomba" icon={<ClipboardCheckIcon className="w-6 h-6"/>}>
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <ul className="space-y-4">
                                {requirements.map(req => (
                                    <li key={req.id} className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-4 mt-1">
                                            ✓
                                        </div>
                                        <p className="text-gray-700">{req.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </Section>

            </main>

            {/* Footer */}
            <footer className="bg-brand-primary text-white text-center py-8">
                <p>&copy; {new Date().getFullYear()} Jember Marching Festival. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-1">Platform by Panitia JMF 2026</p>
            </footer>

            <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
                {selectedImage && (
                    <div>
                        <img src={selectedImage.imageUrl} alt={selectedImage.caption} className="w-full h-auto object-contain rounded-lg max-h-[80vh] shadow-2xl"/>
                        <p className="mt-4 text-center text-white text-base bg-black bg-opacity-50 py-2 px-4 rounded-md">{selectedImage.caption}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};