
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface Machine {
  id: number;
  status: 'available' | 'booked';
  bookedBy?: string;
  timeSlot?: string;
}

interface BookingPageProps {
  machines: Machine[];
  user: { name: string; email: string; phone: string } | null;
  onBookMachine: (machineId: number, timeSlot: string, duration: number) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ machines, user, onBookMachine }) => {
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  const availableMachines = machines.filter(m => m.status === 'available');

  const timeSlots = [
    '6:00 AM - 7:00 AM',
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
  ];

  const durations = [
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
    { label: '90 minutes', value: 90 },
  ];

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login first to book a machine.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMachine || !selectedTimeSlot || !selectedDuration) {
      toast({
        title: "Complete All Fields",
        description: "Please select machine, time slot, and duration.",
        variant: "destructive",
      });
      return;
    }

    const machineId = parseInt(selectedMachine);
    const duration = parseInt(selectedDuration);

    onBookMachine(machineId, selectedTimeSlot, duration);

    toast({
      title: "Booking Successful!",
      description: `Machine ${machineId} booked for ${selectedTimeSlot}`,
    });

    // Reset form
    setSelectedMachine('');
    setSelectedTimeSlot('');
    setSelectedDuration('');
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Washing Machine</h1>
        <p className="text-gray-600">Select an available machine and time slot</p>
      </div>

      {!user && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-orange-800 font-medium">
              Please login first to book a washing machine.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Available Machines Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Available Machines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {availableMachines.map(machine => (
              <div 
                key={machine.id}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                Machine {machine.id}
              </div>
            ))}
            {availableMachines.length === 0 && (
              <p className="text-gray-500">No machines available at the moment</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Make a Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Machine Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Machine
            </label>
            <Select value={selectedMachine} onValueChange={setSelectedMachine}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a machine" />
              </SelectTrigger>
              <SelectContent>
                {availableMachines.map(machine => (
                  <SelectItem key={machine.id} value={machine.id.toString()}>
                    Machine {machine.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Time Slot
            </label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Duration
            </label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Choose duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map(duration => (
                  <SelectItem key={duration.value} value={duration.value.toString()}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Button */}
          <Button 
            onClick={handleBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            disabled={!user || availableMachines.length === 0}
          >
            <Clock className="w-4 h-4" />
            Book Machine
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
