import React from 'react';

interface NotchProps {
  text: string;
}

const Notch: React.FC<NotchProps> = ({ text }) => {
  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="bg-white backdrop-blur-sm text-black font-semibold px-4 py-2 rounded-full shadow-lg border-slate-700">
        {text}
      </div>
    </div>
  );
};

export default Notch;
