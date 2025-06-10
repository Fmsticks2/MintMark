import React from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const CreateEvent = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Create New Event</h1>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Event Name</label>
              <Input 
                placeholder="Enter event name" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Enter location" 
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
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
                    onSelect={setDate}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
              <Textarea 
                placeholder="Enter event description" 
                className="bg-gray-700 border-gray-600 text-white h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Maximum Attendees</label>
              <Input 
                type="number" 
                placeholder="Enter maximum number of attendees" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Event
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;