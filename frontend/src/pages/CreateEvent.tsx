import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns/format';
import { CalendarIcon, MapPinIcon, ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { mintPOAP } from '@/blockchain/mint';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { enhancedIagonStorage, type EventData } from '@/services/IagonStorageService';
import { ContractService } from '@/blockchain/ContractService';
import { OrganizationType } from '@/blockchain/types';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface EventFormData {
  name: string;
  location: string;
  date: Date | undefined;
  description: string;
  maxAttendees: number;
  image: File | null;
  imageHash?: string;
  imageUrl?: string;
  organizationType: 'individual' | 'small-org' | 'enterprise';
  enablePOAPMinting: boolean;
}

const getOrganizationTypeNumber = (type: string): number => {
  switch (type) {
    case 'individual': return OrganizationType.INDIVIDUAL;
    case 'small-org': return OrganizationType.SMALL_ORG;
    case 'enterprise': return OrganizationType.ENTERPRISE;
    default: return OrganizationType.INDIVIDUAL;
  }
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account } = useWallet(); // Add wallet hook to get account
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    location: '',
    date: undefined,
    description: '',
    maxAttendees: 0,
    image: null,
    imageHash: undefined,
    imageUrl: undefined,
    organizationType: 'individual',
    enablePOAPMinting: false
  });

  // Pricing calculation
  const calculateEventPrice = () => {
    let basePrice = 0;
    
    switch (formData.organizationType) {
      case 'individual':
        basePrice = 0; // Free for individuals
        break;
      case 'small-org':
        basePrice = 25; // $25 for small organizations
        break;
      case 'enterprise':
        basePrice = 100; // $100 for enterprises
        break;
    }
    
    // Additional cost for POAP minting capability
    const poapCost = formData.enablePOAPMinting ? 15 : 0;
    
    return basePrice + poapCost;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      
      try {
        // Validate file
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please select an image smaller than 10MB.",
            variant: "destructive"
          });
          return;
        }

        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: "Please select a valid image file.",
            variant: "destructive"
          });
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload with triple-layer security
        const uploadResult = await enhancedIagonStorage.uploadFileSecure(file);
        
        if (uploadResult.success) {
          setFormData(prev => ({ 
            ...prev, 
            image: file,
            imageHash: uploadResult.hash,
            imageUrl: uploadResult.url,
            base64Hash: uploadResult.base64Hash,
            localStorageKey: uploadResult.localStorageKey
          }));
          
          const successLayers = Object.entries(uploadResult.layers)
            .filter(([_, success]) => success)
            .map(([layer]) => layer);
            
          toast({
            title: "Image Secured Successfully",
            description: `Protected across ${successLayers.length} layers: ${successLayers.join(', ')}`,
          });
        } else {
          toast({
            title: "Upload Failed",
            description: uploadResult.error || "All security layers failed.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.location || !date || !formData.description || !formData.maxAttendees) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Create event data for secure storage
      const eventData: EventData = {
        id: `event_${Date.now()}`,
        name: formData.name,
        location: formData.location,
        date: date.toISOString().split('T')[0],
        description: formData.description,
        maxAttendees: formData.maxAttendees,
        imageHash: formData.imageHash,
        imageUrl: formData.imageUrl,
        organizer: 'Current User',
        metadata: {
          category: 'Technology',
          status: 'upcoming',
          time: '10:00 AM',
          registrationDeadline: date.toISOString().split('T')[0],
          requirements: ['Valid ID', 'Registration confirmation'],
          agenda: ['Opening ceremony', 'Main presentation', 'Q&A session', 'Networking'],
          currentAttendees: 0,
          createdAt: new Date().toISOString(),
          platform: 'typescript-design-forge'
        }
      };

      // Create event on blockchain first
      const contractService = ContractService.getInstance();
      const eventParams = {
        name: formData.name,
        organizationType: getOrganizationTypeNumber(formData.organizationType),
        poapEnabled: formData.enablePOAPMinting,
        maxAttendees: formData.maxAttendees,
        eventDate: date ? Math.floor(date.getTime() / 1000) : 0, // Convert to Unix timestamp
        creator: account?.address ? String(account.address) : '', // Explicitly convert to string
      };

      const contractResult = await contractService.createEvent(eventParams);
      
      if (!contractResult.success) {
        toast({
          title: "Blockchain Error",
          description: contractResult.error || "Failed to create event on blockchain.",
          variant: "destructive"
        });
        return;
      }

      // Store event data securely on Iagon after blockchain success
      const storageResult = await enhancedIagonStorage.storeEventDataSecure(eventData);
      
      if (storageResult.success) {
        const successLayers = Object.entries(storageResult.layers)
          .filter(([_, success]) => success)
          .map(([layer]) => layer);
          
        toast({
          title: "Event Created Successfully!",
          description: `Event created on blockchain and data protected across ${successLayers.length} security layers: ${successLayers.join(', ')}`,
        });
        
        // Store comprehensive reference including blockchain transaction
        const eventReference = {
          id: eventData.id,
          name: eventData.name,
          iagonHash: storageResult.hash,
          base64Hash: storageResult.base64Hash,
          localStorageKey: storageResult.localStorageKey,
          securityLayers: successLayers,
          blockchainTxHash: contractResult.hash,
          organizationType: formData.organizationType,
          poapEnabled: formData.enablePOAPMinting,
          createdAt: new Date().toISOString()
        };
        
        const existingRefs = JSON.parse(localStorage.getItem('userEventRefs') || '[]');
        existingRefs.push(eventReference);
        localStorage.setItem('userEventRefs', JSON.stringify(existingRefs));
      } else {
        toast({
          title: "Storage Warning",
          description: storageResult.error || "Event created on blockchain but using fallback storage.",
          variant: "destructive"
        });
        
        // Fallback to localStorage with blockchain info
        const existingEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
        existingEvents.push({
          ...eventData,
          image: formData.imageUrl,
          blockchainTxHash: contractResult.hash,
          organizationType: formData.organizationType,
          poapEnabled: formData.enablePOAPMinting
        });
        localStorage.setItem('userEvents', JSON.stringify(existingEvents));
      }

      toast({
        title: "Event Created Successfully!",
        description: `${formData.name} has been created and is now live.`,
      });

      // Navigate to explore events page
      setTimeout(() => {
        navigate('/explore-events');
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24"
      >
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Create New Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Type Selection */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Organization Type & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.organizationType === 'individual' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, organizationType: 'individual' }))}
                  >
                    <h4 className="text-white font-semibold">Individual</h4>
                    <p className="text-green-400 font-bold text-lg">Free</p>
                    <p className="text-gray-300 text-sm">Personal events</p>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.organizationType === 'small-org' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, organizationType: 'small-org' }))}
                  >
                    <h4 className="text-white font-semibold">Small Organization</h4>
                    <p className="text-blue-400 font-bold text-lg">$25</p>
                    <p className="text-gray-300 text-sm">Up to 500 participants</p>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.organizationType === 'enterprise' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, organizationType: 'enterprise' }))}
                  >
                    <h4 className="text-white font-semibold">Enterprise</h4>
                    <p className="text-purple-400 font-bold text-lg">$100</p>
                    <p className="text-gray-300 text-sm">Unlimited participants</p>
                  </div>
                </div>
                
                {/* POAP Minting Option */}
                <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">Enable POAP NFT Minting</h4>
                      <p className="text-gray-300 text-sm">Allow participants to mint commemorative NFTs after the event</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enablePOAP"
                        checked={formData.enablePOAPMinting}
                        onChange={(e) => setFormData(prev => ({ ...prev, enablePOAPMinting: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enablePOAP" className="text-yellow-400 font-semibold">+$15</label>
                    </div>
                  </div>
                </div>
                
                {/* Total Price Display */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total Event Creation Cost:</span>
                    <span className="text-white font-bold text-xl">
                      {calculateEventPrice() === 0 ? 'Free' : `$${calculateEventPrice()}`}
                    </span>
                  </div>
                  {formData.enablePOAPMinting && (
                    <p className="text-blue-100 text-sm mt-2">
                      ✨ Includes POAP NFT minting capability for all participants
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Event Name *</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter event name" 
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Event Image</label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Upload className="w-8 h-8 mb-2 text-blue-400 animate-spin" />
                          <p className="text-sm text-gray-400">Uploading to Iagon network...</p>
                          <p className="text-xs text-gray-500 mt-1">Securing your image with decentralized storage</p>
                        </div>
                      ) : imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover rounded" />
                          {formData.imageHash && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              ✓ Secured
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400 text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          <p className="text-xs text-blue-400 mt-1">🔒 Stored securely on Iagon network</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ 
                        ...prev, 
                        image: null, 
                        imageHash: undefined, 
                        imageUrl: undefined 
                      }));
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Location *</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location" 
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setFormData(prev => ({ ...prev, date: selectedDate }));
                    }}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Description *</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description" 
                className="bg-gray-700 border-gray-600 text-white h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Maximum Attendees *</label>
              <Input 
                type="number" 
                value={formData.maxAttendees || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 0 }))}
                placeholder="Enter maximum number of attendees" 
                className="bg-gray-700 border-gray-600 text-white"
                min="1"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Creating Event...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </form>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default CreateEvent;