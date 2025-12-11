'use client';

import React from 'react';
import Image from 'next/image'; // Import Image
// MapPin e Star não são mais usados no MapScreen, mas podem ser em outros lugares, então não os removo daqui se não tiver certeza.

// Ecrã de Exemplo: Mapa
export const MapScreen = () => (
  <div className="w-full h-full bg-gray-100 flex flex-col relative">
    {' '}
    {/* Added relative here */}
    <Image
      src="/app-example-1.jpg"
      alt="App Example"
      fill={true} // Use fill to cover parent
      className="object-cover pointer-events-none" // Adicionado pointer-events-none aqui
    />
  </div>
);

// Componente Mockup
export const MobileMockup = ({
  screen,
  className = '',
}: {
  screen: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative mx-auto border-[#0F172A] bg-[#0F172A] border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl ${className}`}
  >
    <div className="h-[32px] w-[3px] bg-[#0F172A] absolute -left-[17px] top-[72px] rounded-l-lg"></div>
    <div className="h-[46px] w-[3px] bg-[#0F172A] absolute -left-[17px] top-[124px] rounded-l-lg"></div>
    <div className="h-[46px] w-[3px] bg-[#0F172A] absolute -left-[17px] top-[178px] rounded-l-lg"></div>
    <div className="h-[64px] w-[3px] bg-[#0F172A] absolute -right-[17px] top-[142px] rounded-r-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
      {/* Dynamic Screen Content */}
      {screen}
    </div>
  </div>
);
