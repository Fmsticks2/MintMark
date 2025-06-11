
import React from 'react';
import { Header } from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventDetails from '@/components/EventDetails';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-20"
      >
        <HeroSection />
        <EventDetails />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Index;
