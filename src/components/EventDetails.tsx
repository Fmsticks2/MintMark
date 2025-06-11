
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMintedNFT, setHasMintedNFT] = useState(false);

  const handleMintNFT = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setHasMintedNFT(true);
      
      toast({
        title: "POAP NFT Minted Successfully!",
        description: "Your Proof of Attendance NFT has been minted to your wallet.",
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <div className="text-center mt-12 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/event/1">
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    View Event Details
                  </Button>
                </Link>
                <Button 
                  onClick={handleMintNFT}
                  disabled={isSubmitting || hasMintedNFT}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Minting...' : hasMintedNFT ? 'NFT Minted ✓' : 'Mint POAP NFT'}
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {hasMintedNFT ? 'You have successfully minted your POAP NFT!' : 'Mint your Proof of Attendance Protocol NFT for this event'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EventDetails;
