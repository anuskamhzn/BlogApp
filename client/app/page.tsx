'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import HomePage from './pages/HomePage';

export default function Home() {
  return (
    <>
      <main className="bg-[#f5e8d3] font-serif overflow-hidden">
        <Navbar />
        <HomePage />
        <Footer />
      </main>
    </>
  );
}