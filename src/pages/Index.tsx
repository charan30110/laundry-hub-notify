import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Timer, Droplets, CheckCircle, Clock } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import UserProfile from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";

interface Machine {
  id: number;
  status: 'available' | 'in-use' | 'done';
  timeRemaining: number;
  totalTime: number;
  userBooked?: string;
}

const Index = () => {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([
    { id: 1, status: 'available', timeRemaining: 0, totalTime: 0 },
    { id: 2, status: 'available', timeRemaining: 0, totalTime: 0 },
    { id: 3, status: 'available', timeRemaining: 0, totalTime: 0 },
    { id: 4, status: 'available', timeRemaining: 0, totalTime: 0 },
  ]);

  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<number | null>(null);

  // Duration options in minutes
  const durationOptions = [
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
    { label: '90 minutes', value: 90 },
  ];

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onLogin={login} />;
  }

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prevMachines => 
        prevMachines.map(machine => {
          if (machine.status === 'in-use' && machine.timeRemaining > 0) {
            const newTimeRemaining = machine.timeRemaining - 1;
            
            // Check if cycle is complete
            if (newTimeRemaining === 0) {
              // Play notification sound
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkcBTuCzvLZiAoJE1+x5O2nWxELTqXh8bllIA');
              audio.play().catch(() => {}); // Ignore errors if audio can't play
              
              // Show toast notification
              toast({
                title: "Laundry Complete! 🎉",
                description: `Machine ${machine.id} cycle is finished. Your laundry is ready!`,
                duration: 10000,
              });
              
              return { ...machine, status: 'done' as const, timeRemaining: 0 };
            }
            
            return { ...machine, timeRemaining: newTimeRemaining };
          }
          return machine;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const bookMachine = (machineId: number, duration: number) => {
    if (!selectedDuration) {
      toast({
        title: "Please select duration",
        description: "Choose how long you need the washing machine.",
        variant: "destructive",
      });
      return;
    }

    setMachines(prevMachines =>
      prevMachines.map(machine =>
        machine.id === machineId
          ? {
              ...machine,
              status: 'in-use' as const,
              timeRemaining: duration * 60, // Convert minutes to seconds
              totalTime: duration * 60,
              userBooked: user?.name || 'Unknown User',
            }
          : machine
      )
    );

    toast({
      title: "Machine Booked Successfully! ✅",
      description: `Machine ${machineId} is now running for ${duration} minutes.`,
    });

    setDialogOpen(null);
    setSelectedDuration('');
  };

  const resetMachine = (machineId: number) => {
    setMachines(prevMachines =>
      prevMachines.map(machine =>
        machine.id === machineId
          ? { ...machine, status: 'available' as const, timeRemaining: 0, totalTime: 0, userBooked: undefined }
          : machine
      )
    );

    toast({
      title: "Machine Reset",
      description: `Machine ${machineId} is now available for booking.`,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'in-use': return 'bg-blue-500';
      case 'done': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5" />;
      case 'in-use': return <Timer className="w-5 h-5" />;
      case 'done': return <Clock className="w-5 h-5" />;
      default: return null;
    }
  };

  const getProgressPercentage = (machine: Machine) => {
    if (machine.totalTime === 0) return 0;
    return ((machine.totalTime - machine.timeRemaining) / machine.totalTime) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* User Profile */}
        <UserProfile user={user!} onLogout={logout} />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Smart Laundry System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book your washing machine, track your cycle, and get notified when it's done
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {machines.filter(m => m.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Timer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Use</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {machines.filter(m => m.status === 'in-use').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Done</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {machines.filter(m => m.status === 'done').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Droplets className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Machines</p>
                  <p className="text-2xl font-bold text-purple-600">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {machines.map((machine) => (
            <Card 
              key={machine.id} 
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Machine {machine.id}
                  </CardTitle>
                  <Badge 
                    className={`${getStatusColor(machine.status)} text-white border-0 flex items-center gap-1`}
                  >
                    {getStatusIcon(machine.status)}
                    {machine.status.charAt(0).toUpperCase() + machine.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                {machine.userBooked && machine.status === 'in-use' && (
                  <p className="text-sm text-gray-600">Booked by: {machine.userBooked}</p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Machine Visual */}
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-4 border-gray-400 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full border-4 ${
                      machine.status === 'in-use' ? 'border-blue-500 animate-spin' : 'border-gray-400'
                    } flex items-center justify-center bg-white`}>
                      <Droplets className={`w-8 h-8 ${
                        machine.status === 'in-use' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {machine.status === 'in-use' && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${getProgressPercentage(machine)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Timer Display */}
                {machine.status === 'in-use' && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">
                      {formatTime(machine.timeRemaining)}
                    </p>
                  </div>
                )}

                {machine.status === 'done' && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg font-semibold text-orange-600">Cycle Complete!</p>
                    <p className="text-sm text-gray-600">Ready to collect</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {machine.status === 'available' && (
                    <Dialog open={dialogOpen === machine.id} onOpenChange={(open) => setDialogOpen(open ? machine.id : null)}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Book Machine
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book Machine {machine.id}</DialogTitle>
                          <DialogDescription>
                            Select how long you need the washing machine
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Wash Duration
                            </label>
                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                {durationOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            onClick={() => bookMachine(machine.id, parseInt(selectedDuration))}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!selectedDuration}
                          >
                            Start Washing
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {machine.status === 'done' && (
                    <Button 
                      onClick={() => resetMachine(machine.id)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Collect & Reset
                    </Button>
                  )}

                  {machine.status === 'in-use' && (
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-600 font-medium">
                        Currently Running...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Smart Laundry Management System - Never miss your laundry again!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
