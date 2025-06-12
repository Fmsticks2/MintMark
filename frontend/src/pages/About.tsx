import React from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24"
      >
        <section className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">About MintMark POAP</h1>
          
          <div className="prose prose-lg dark:prose-invert text-gray-300">
            <h2 className="text-2xl font-semibold mb-4 text-white">What is MintMark POAP?</h2>
            <p>
              MintMark POAP (Proof of Attendance Protocol) is a decentralized application built on the Aptos blockchain
              that allows event organizers to create and distribute digital collectibles to event attendees.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">How it Works</h2>
            <p>
              When you attend an event, you can connect your Aptos wallet and mint a unique POAP NFT that proves
              your attendance. These NFTs are stored on the Aptos blockchain, making them verifiable and permanent
              proof of your participation.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Easy-to-use interface for minting POAPs</li>
              <li>Secure wallet connection using Petra Wallet</li>
              <li>Permanent storage on Aptos blockchain</li>
              <li>Unique collectible for each event</li>
              <li>Verifiable proof of attendance</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">Technology Stack</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Frontend: React with TypeScript</li>
              <li>Styling: Tailwind CSS</li>
              <li>Blockchain: Aptos Network</li>
              <li>Smart Contract: Move Language</li>
              <li>Wallet Integration: Petra Wallet</li>
            </ul>
          </div>
        </section>
      </motion.main>
      <Footer />
    </div>
  );
}