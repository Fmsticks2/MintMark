import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPinIcon, Calendar, Users, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useContractService } from '../hooks/useContractService';

interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  maxAttendees: number;
  currentAttendees: number;
  organizer: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  registrationDeadline: string;
  requirements: string[];
  agenda: string[];
  image?: string;
}

interface Registration {
  name: string;
  email: string;
  organization: string;
  experience: string;
  motivation: string;
  walletAddress: string;
}

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  experience: string;
  motivation: string;
  walletAddress: string;
  registrationDate: string;
  eventId: number;
}

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMintedNFT, setHasMintedNFT] = useState(false);
  const [registration, setRegistration] = useState<Registration>({
    name: '',
    email: '',
    organization: '',
    experience: '',
    motivation: '',
    walletAddress: ''
  });
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [isEventCreator, setIsEventCreator] = useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  
  // Wallet connection state
  const { account, connected: isWalletConnected } = useWallet();

  // Mock events data - in real app, this would come from API
  const mockEvents: Event[] = [
    {
      id: 1,
      name: 'Web3 Conference 2024',
      location: 'San Francisco, CA',
      date: '2024-03-15',
      time: '09:00 AM - 06:00 PM',
      description: 'Join us for the biggest Web3 conference of the year featuring industry leaders and innovative projects. This comprehensive event will cover the latest developments in blockchain technology, DeFi protocols, NFTs, and the future of decentralized applications.',
      maxAttendees: 500,
      currentAttendees: 250,
      organizer: 'Web3 Foundation',
      category: 'Conference',
      status: 'ended',
      registrationDeadline: '2024-03-10',
      requirements: ['Basic understanding of blockchain', 'Laptop for workshops', 'Valid ID'],
      agenda: [
        '09:00 - 10:00: Registration & Networking',
        '10:00 - 11:30: Keynote: The Future of Web3',
        '11:45 - 12:45: Panel: DeFi Innovation',
        '14:00 - 15:30: Workshop: Building dApps',
        '15:45 - 17:00: NFT Marketplace Demo',
        '17:00 - 18:00: Closing & Networking'
      ]
    },
    {
      id: 2,
      name: 'Blockchain Developer Summit',
      location: 'New York, NY',
      date: '2024-04-20',
      time: '10:00 AM - 05:00 PM',
      description: 'A comprehensive summit for blockchain developers featuring workshops, networking, and the latest in DeFi technology.',
      maxAttendees: 300,
      currentAttendees: 180,
      organizer: 'DevCorp',
      category: 'Summit',
      status: 'upcoming',
      registrationDeadline: '2024-04-15',
      requirements: ['Programming experience', 'GitHub account', 'Development environment setup'],
      agenda: [
        '10:00 - 11:00: Welcome & Overview',
        '11:00 - 12:30: Smart Contract Security',
        '14:00 - 15:30: Hands-on Workshop',
        '15:45 - 17:00: Q&A and Networking'
      ]
    },
    {
      id: 3,
      name: 'NFT Art Exhibition',
      location: 'Los Angeles, CA',
      date: '2024-05-10',
      time: '02:00 PM - 08:00 PM',
      description: 'Explore the intersection of art and technology in this exclusive NFT exhibition featuring renowned digital artists.',
      maxAttendees: 200,
      currentAttendees: 150,
      organizer: 'Digital Arts Collective',
      category: 'Exhibition',
      status: 'upcoming',
      registrationDeadline: '2024-05-05',
      requirements: ['Interest in digital art', 'Crypto wallet (optional)'],
      agenda: [
        '14:00 - 15:00: Gallery Opening',
        '15:00 - 16:30: Artist Presentations',
        '17:00 - 18:30: Interactive Demos',
        '18:30 - 20:00: Networking Reception'
      ]
    }
  ];

  useEffect(() => {
    if (id) {
      // Check if this is a user-created event first
      const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
      const userEvent = userEvents.find((event: any) => event.id === parseInt(id));
      
      if (userEvent) {
        setEvent(userEvent);
        setIsEventCreator(true); // User created this event
      } else {
        // Otherwise use mock data for demo events
        const foundEvent = mockEvents.find(e => e.id === parseInt(id));
        setEvent(foundEvent || null);
        setIsEventCreator(false);
      }
      
      // Load registered users for this event
      const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      const eventRegistrations = allRegistrations.filter((reg: RegisteredUser) => reg.eventId === parseInt(id));
      setRegisteredUsers(eventRegistrations);
      
      // Check if current user is already registered
      const currentUserEmail = localStorage.getItem('currentUserEmail') || 'user@example.com';
      const userRegistration = eventRegistrations.find((reg: RegisteredUser) => reg.email === currentUserEmail);
      setIsRegistered(!!userRegistration);
      
      // Check if user has minted NFT for this event
      const mintedNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
      setHasMintedNFT(mintedNFTs.includes(parseInt(id)));
    }
  }, [id]);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate wallet address format (basic validation)
      if (!registration.walletAddress || registration.walletAddress.length < 10) {
        throw new Error('Please enter a valid wallet address');
      }
      
      // If wallet is connected, ensure the entered address matches the connected wallet
      if (isWalletConnected && account && account.address) {
        if (registration.walletAddress.toLowerCase() !== account.address.toString().toLowerCase()) {
          throw new Error('The entered wallet address must match your connected wallet address.');
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create registration record
      const newRegistration: RegisteredUser = {
        id: Date.now().toString(),
        ...registration,
        registrationDate: new Date().toISOString(),
        eventId: parseInt(id!)
      };
      
      // Update registrations in localStorage
      const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      allRegistrations.push(newRegistration);
      localStorage.setItem('eventRegistrations', JSON.stringify(allRegistrations));
      
      // Update current user email for future reference
      localStorage.setItem('currentUserEmail', registration.email);
      
      // Update local state
      setRegisteredUsers([...registeredUsers, newRegistration]);
      setIsRegistered(true);
      setShowRegistrationForm(false);
      
      // Reset form
      setRegistration({
        name: '',
        email: '',
        organization: '',
        experience: '',
        motivation: '',
        walletAddress: ''
      });
      
      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event. Your wallet address has been recorded for POAP NFT minting.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMintNFT = async () => {
    // Validation checks
    if (!event || event.status !== 'ended') {
      toast({
        title: "Minting Not Available",
        description: "POAP NFTs can only be minted after the event has ended.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isWalletConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint your POAP NFT.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isRegistered) {
      toast({
        title: "Registration Required",
        description: "You must be registered for this event to mint a POAP NFT.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the connected wallet matches the registered wallet address
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const registeredUser = registeredUsers.find(user => user.email === currentUserEmail);
    
    if (!registeredUser) {
      toast({
        title: "Registration Not Found",
        description: "Could not find your registration details.",
        variant: "destructive",
      });
      return;
    }
    
    if (registeredUser.walletAddress.toLowerCase() !== account.address?.toString().toLowerCase()) {
      toast({
        title: "Wallet Mismatch",
        description: "The connected wallet does not match the wallet address used during registration.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the updated POAP minting interface
      const { mintPOAP } = useContractService();
      const poapParams = {
        participant: account.address.toString(),
        eventId: parseInt(id!),
        eventCreator: event.organizer || account.address.toString() // Use event organizer or current user
      };
      
      const result = await mintPOAP(poapParams);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to mint POAP');
      }
      
      // Update local storage
      const mintedNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
      mintedNFTs.push(parseInt(id!));
      localStorage.setItem('mintedNFTs', JSON.stringify(mintedNFTs));
      
      setHasMintedNFT(true);
      
      toast({
        title: "POAP NFT Minted Successfully!",
        description: `Your Proof of Attendance NFT has been minted to ${account.address?.toString()}`,
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: 'bg-blue-500',
      ongoing: 'bg-green-500',
      ended: 'bg-gray-500'
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24"
      >
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/explore-events" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          {/* Event Header */}
          <Card className="bg-gray-800 border-gray-700 mb-8 overflow-hidden">
            {event.image ? (
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-4xl text-white mb-2">{event.name}</CardTitle>
                        <CardDescription className="text-gray-200 text-lg">
                          Organized by {event.organizer}
                        </CardDescription>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-white">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{event.currentAttendees} / {event.maxAttendees} registered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl text-white mb-2">{event.name}</CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      Organized by {event.organizer}
                    </CardDescription>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>
            )}
            <CardContent className={event.image ? "border-t border-gray-700" : ""}>
              {!event.image && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-blue-400" />
                      <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPinIcon className="h-5 w-5 mr-3 text-blue-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-blue-400" />
                      <span>{event.currentAttendees} / {event.maxAttendees} registered</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-blue-400" />
                      <span>Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-4">
                    {event.status === 'ended' ? (
                      <div className="space-y-4">
                        {isRegistered && !hasMintedNFT && (
                          <div className="space-y-2">
                            <Button 
                              onClick={handleMintNFT}
                              disabled={isSubmitting || !isWalletConnected}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600"
                            >
                              {isSubmitting ? 'Minting...' : 'Mint POAP NFT'}
                            </Button>
                            {!isWalletConnected && (
                              <div className="text-yellow-400 text-sm text-center">
                                ⚠️ Connect your wallet to mint POAP NFT
                              </div>
                            )}
                            {isWalletConnected && account && (
                              <div className="text-green-400 text-xs text-center font-mono">
                                ✓ Wallet connected: {account.address?.toString().slice(0, 6)}...{account.address?.toString().slice(-4)}
                              </div>
                            )}
                          </div>
                        )}
                        {hasMintedNFT && (
                          <div className="flex items-center justify-center text-green-400">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            POAP NFT Minted
                          </div>
                        )}
                        {!isRegistered && (
                          <div className="text-gray-400 text-center">
                            Only registered attendees can mint POAP NFTs
                          </div>
                        )}
                      </div>
                    ) : isRegistered ? (
                      <div className="flex items-center justify-center text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        You are registered for this event
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setShowRegistrationForm(true)}
                        disabled={event.currentAttendees >= event.maxAttendees}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {event.currentAttendees >= event.maxAttendees ? 'Event Full' : 'Register Now'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>

              {/* Agenda */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Requirements */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {event.requirements.map((req, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Category:</span>
                    <p className="text-white">{event.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Organizer:</span>
                    <p className="text-white">{event.organizer}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Capacity:</span>
                    <p className="text-white">{event.maxAttendees} attendees</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Registered Users List Modal */}
          {showRegisteredUsers && isEventCreator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Registered Users ({registeredUsers.length})</CardTitle>
                  <CardDescription className="text-gray-400">
                    List of all users registered for {event.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[60vh]">
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No users registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registeredUsers.map((user) => (
                        <div key={user.id} className="bg-gray-700 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-white">{user.name}</h4>
                              <p className="text-sm text-gray-300">{user.email}</p>
                              {user.organization && (
                                <p className="text-sm text-gray-400">{user.organization}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-400">Experience:</span> {user.experience || 'Not specified'}
                              </p>
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-400">Registered:</span> {new Date(user.registrationDate).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400 font-mono break-all">
                                <span className="text-gray-400">Wallet:</span> {user.walletAddress}
                              </p>
                            </div>
                          </div>
                          {user.motivation && (
                            <div className="mt-3 pt-3 border-t border-gray-600">
                              <p className="text-sm text-gray-400">Motivation:</p>
                              <p className="text-sm text-gray-300">{user.motivation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setShowRegisteredUsers(false)}
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Registration Form Modal */}
          {showRegistrationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="bg-gray-800 border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="text-white">Register for {event.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Please fill out the form below to register for this event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        value={registration.name}
                        onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registration.email}
                        onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization" className="text-gray-300">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={registration.organization}
                        onChange={(e) => setRegistration({ ...registration, organization: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-gray-300">Experience Level</Label>
                      <Input
                        id="experience"
                        value={registration.experience}
                        onChange={(e) => setRegistration({ ...registration, experience: e.target.value })}
                        placeholder="e.g., Beginner, Intermediate, Advanced"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="motivation" className="text-gray-300">Why do you want to attend?</Label>
                      <Textarea
                        id="motivation"
                        value={registration.motivation}
                        onChange={(e) => setRegistration({ ...registration, motivation: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="walletAddress" className="text-gray-300">Wallet Address *</Label>
                      <div className="space-y-2">
                        <Input
                          id="walletAddress"
                          value={registration.walletAddress}
                          onChange={(e) => setRegistration({ ...registration, walletAddress: e.target.value })}
                          placeholder="0x... (for POAP NFT minting)"
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                        {isWalletConnected && account && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-400">✓ Wallet connected</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setRegistration({ ...registration, walletAddress: account.address?.toString() || '' })}
                              className="text-xs bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                            >
                              Use Connected Wallet
                            </Button>
                          </div>
                        )}
                        {!isWalletConnected && (
                          <div className="text-xs text-yellow-400">
                            💡 Connect your wallet to auto-fill this field
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        This address will be used to mint your POAP NFT after the event
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRegistrationForm(false)}
                        className="flex-1 bg-gray-700 text-white border-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default EventDetailsPage;