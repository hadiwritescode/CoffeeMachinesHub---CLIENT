import React from 'react';
import { Gift } from 'lucide-react';

const RewardsButton: React.FC = () => {
  return (
    <button className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform z-40">
      <Gift size={20} />
      <span className="font-medium">Rewards</span>
    </button>
  );
};

export default RewardsButton;
