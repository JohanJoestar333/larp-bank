import React from 'react';

export const IPhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex justify-center text-slate-100 selection:bg-white/20">
      <div className="w-full max-w-md min-h-screen relative flex flex-col bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-white/[0.04]">
        {children}
      </div>
    </div>
  );
};
