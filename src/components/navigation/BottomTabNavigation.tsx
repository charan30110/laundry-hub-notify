
import React from 'react';
import { User, Home, Calendar } from 'lucide-react';

interface BottomTabNavigationProps {
  activeTab: 'login' | 'dashboard' | 'booking';
  onTabChange: (tab: 'login' | 'dashboard' | 'booking') => void;
}

const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login' as const, label: 'Login', icon: User },
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'booking' as const, label: 'Booking', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabNavigation;
