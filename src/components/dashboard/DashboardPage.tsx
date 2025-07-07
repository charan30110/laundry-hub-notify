
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, CheckCircle } from "lucide-react";

interface Machine {
  id: number;
  status: 'available' | 'booked';
  bookedBy?: string;
  timeSlot?: string;
  timeRemaining?: number;
}

interface DashboardPageProps {
  machines: Machine[];
  user: { name: string; email: string; phone: string } | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ machines, user }) => {
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
    return status === 'available' ? 'bg-green-500' : 'bg-orange-500';
  };

  const getStatusIcon = (status: string) => {
    return status === 'available' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        {user && (
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold text-green-600">
                  {machines.filter(m => m.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Booked</p>
                <p className="text-xl font-bold text-orange-600">
                  {machines.filter(m => m.status === 'booked').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machines.map((machine) => (
          <Card key={machine.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Machine {machine.id}
                </CardTitle>
                <Badge 
                  className={`${getStatusColor(machine.status)} text-white border-0 flex items-center gap-1`}
                >
                  {getStatusIcon(machine.status)}
                  {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Machine Visual */}
              <div className="w-full h-24 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border-2 border-gray-400 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full border-2 ${
                  machine.status === 'booked' ? 'border-orange-500 animate-pulse' : 'border-gray-400'
                } flex items-center justify-center bg-white`}>
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Machine Details */}
              {machine.status === 'booked' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Booked by:</span>
                    <span className="font-medium">{machine.bookedBy}</span>
                  </div>
                  
                  {machine.timeSlot && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Time Slot:</span>
                      <span className="font-medium">{machine.timeSlot}</span>
                    </div>
                  )}

                  {machine.timeRemaining && (
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <p className="text-xs text-gray-600">Time Remaining</p>
                      <p className="text-lg font-mono font-bold text-orange-600">
                        {formatTime(machine.timeRemaining)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {machine.status === 'available' && (
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="text-sm font-medium text-green-600">
                    Ready for booking
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
