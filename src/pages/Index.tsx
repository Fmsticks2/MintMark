
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventDetails from '@/components/EventDetails';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <HeroSection />
      <EventDetails />
      <Footer />
    </div>
  );
};

export default Index;
