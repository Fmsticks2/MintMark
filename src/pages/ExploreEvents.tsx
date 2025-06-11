import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon, PlusIcon } from 'lucide-react';

const ExploreEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    // Load user-created events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
    setUserEvents(storedEvents);
  }, []);

  // Mock data - replace with actual API call
  const mockEvents = [
    {
      id: 1,
      name: 'Web3 Conference 2024',
      location: 'San Francisco, CA',
      date: '2024-03-15',
      description: 'Join us for the biggest Web3 conference of the year featuring industry leaders and innovative projects.',
      maxAttendees: 500,
      currentAttendees: 250,
    },
    {
      id: 2,
      name: 'Blockchain Developer Summit',
      location: 'New York, NY',
      date: '2024-04-20',
      description: 'A comprehensive summit for blockchain developers featuring workshops, networking, and the latest in DeFi technology.',
      maxAttendees: 300,
      currentAttendees: 180,
    },
    {
      id: 3,
      name: 'NFT Art Exhibition',
      location: 'Los Angeles, CA',
      date: '2024-05-10',
      description: 'Explore the intersection of art and technology in this exclusive NFT exhibition featuring renowned digital artists.',
      maxAttendees: 200,
      currentAttendees: 150,
    },
    {
      id: 4,
      name: 'Crypto Trading Workshop',
      location: 'Chicago, IL',
      date: '2024-06-05',
      description: 'Learn advanced trading strategies and risk management techniques from professional cryptocurrency traders.',
      maxAttendees: 100,
      currentAttendees: 75,
    },
    {
      id: 5,
      name: 'DeFi Protocol Launch',
      location: 'Austin, TX',
      date: '2024-07-12',
      description: 'Witness the launch of the next generation DeFi protocol with live demonstrations and exclusive early access.',
      maxAttendees: 400,
      currentAttendees: 320,
    },
    {
      id: 6,
      name: 'Smart Contract Security Audit',
      location: 'Seattle, WA',
      date: '2024-08-18',
      description: 'Intensive workshop on smart contract security, auditing techniques, and best practices for secure development.',
      maxAttendees: 150,
      currentAttendees: 90,
    },
  ];

  // Combine mock events with user-created events
  const allEvents = [...mockEvents, ...userEvents];

  // Filter events based on search and filters
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || event.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Explore Events</h1>
            <div className="flex gap-4">
              <Input 
                placeholder="Search events..." 
                className="w-64 bg-gray-800 border-gray-700 text-white"
              />
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700">
                Filter
              </Button>
              <Link to="/create-event">
                <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                {event.image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{event.name}</CardTitle>
                      <CardDescription className="text-gray-400 flex items-center mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {event.location}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {event.category}
                      </Badge>
                      {userEvents.some(userEvent => userEvent.id === event.id) && (
                        <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                          Your Event
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {event.currentAttendees}/{event.maxAttendees}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/event/${event.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default ExploreEvents;