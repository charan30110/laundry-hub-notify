
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import BottomTabNavigation from '@/components/navigation/BottomTabNavigation';
import LoginPage from '@/components/login/LoginPage';
import DashboardPage from '@/components/dashboard/DashboardPage';
import BookingPage from '@/components/booking/BookingPage';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Machine {
  id: number;
  status: 'available' | 'booked';
  bookedBy?: string;
  timeSlot?: string;
  timeRemaining?: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'dashboard' | 'booking'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [machines, setMachines] = useState<Machine[]>([
    { id: 1, status: 'available' },
    { id: 2, status: 'available' },
    { id: 3, status: 'available' },
    { id: 4, status: 'available' },
  ]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('washingMachineUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setActiveTab('dashboard');
    }
  }, []);

  // Timer effect for booked machines
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prevMachines => 
        prevMachines.map(machine => {
          if (machine.status === 'booked' && machine.timeRemaining && machine.timeRemaining > 0) {
            const newTimeRemaining = machine.timeRemaining - 1;
            
            if (newTimeRemaining === 0) {
              return { 
                ...machine, 
                status: 'available' as const, 
                timeRemaining: undefined,
                bookedBy: undefined,
                timeSlot: undefined
              };
            }
            
            return { ...machine, timeRemaining: newTimeRemaining };
          }
          return machine;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('washingMachineUser', JSON.stringify(userData));
    setActiveTab('dashboard');
  };

  const handleBookMachine = (machineId: number, timeSlot: string, duration: number) => {
    if (!user) return;

    setMachines(prevMachines =>
      prevMachines.map(machine =>
        machine.id === machineId
          ? {
              ...machine,
              status: 'booked' as const,
              bookedBy: user.name,
              timeSlot: timeSlot,
              timeRemaining: duration * 60, // Convert minutes to seconds
            }
          : machine
      )
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <DashboardPage machines={machines} user={user} />;
      case 'booking':
        return <BookingPage machines={machines} user={user} onBookMachine={handleBookMachine} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderActiveTab()}
      <BottomTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </div>
  );
};

export default Index;
