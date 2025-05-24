
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EventDetailRowProps {
  label: string;
  value: string;
  isDescription?: boolean;
}

const EventDetailRow = ({ label, value, isDescription = false }: EventDetailRowProps) => (
  <div className={`flex ${isDescription ? 'flex-col sm:flex-row sm:items-start' : 'justify-between items-center'} py-4 border-b border-gray-700 last:border-b-0`}>
    <span className={`text-gray-400 font-medium ${isDescription ? 'mb-2 sm:mb-0 sm:w-1/3 sm:flex-shrink-0' : ''}`}>{label}</span>
    <span className={`text-white font-semibold ${isDescription ? 'sm:w-2/3 text-left' : ''}`}>{value}</span>
  </div>
);

const EventDetails = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Event Details
        </h2>
        
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="space-y-0">
              <EventDetailRow 
                label="Event Name" 
                value="Aptos BuildSprint OAU 2025" 
              />
              <EventDetailRow 
                label="Date" 
                value="May 24, 2025" 
              />
              <EventDetailRow 
                label="Description" 
                value="Getting familair with Aptos blockchain as Builders and Developers" 
                isDescription={true}
              />
            </div>
            
            <div className="text-center mt-12">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Mint NFT
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EventDetails;
