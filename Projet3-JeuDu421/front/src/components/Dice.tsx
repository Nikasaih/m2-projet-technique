import React from 'react';

interface DiceProps {
  values: number[];
}

const Dice: React.FC<DiceProps> = ({ values }) => {

    if (values.length == 0) {
        values = [0, 0, 0]
    }

  return (
    <div className="flex space-x-2 text-gray-800 justify-center mb-5">
      {values.map((value, index) => (
        <div
          key={index}
          className="w-12 h-12 flex items-center justify-center bg-gray-200 border border-black text-xl font-bold"
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default Dice;
