'use client';

import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Partners } from '@/components/landing/Partners';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="font-sans text-foreground bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Partners />
      <Testimonials />
      <Footer />
    </div>
  );
}
