import React from 'react';

interface DiceProps {
  values: number[];
}

const Dice: React.FC<DiceProps> = ({ values }) => {
  return (
    <div className="flex space-x-2">
      {values.map((value, index) => (
        <div
          key={index}
          className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-xl font-bold"
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default Dice;
