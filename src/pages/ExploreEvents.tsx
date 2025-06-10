import React from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinIcon, Calendar, Users } from 'lucide-react';

const ExploreEvents = () => {
  // Mock data - replace with actual API call
  const events = [
    {
      id: 1,
      name: 'Web3 Conference 2024',
      location: 'San Francisco, CA',
      date: '2024-03-15',
      description: 'Join us for the biggest Web3 conference of the year featuring industry leaders and innovative projects.',
      maxAttendees: 500,
      currentAttendees: 250,
    },
    // Add more mock events here
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription className="text-gray-400 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.currentAttendees} / {event.maxAttendees} attendees
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExploreEvents;