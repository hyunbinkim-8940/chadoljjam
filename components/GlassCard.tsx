import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  padding = "p-6" 
}) => {
  return (
    <div className={`
      relative
      bg-white/60
      backdrop-blur-2xl 
      border border-white/60
      shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
      rounded-3xl 
      text-slate-800
      overflow-hidden
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none
      ${padding} 
      ${className}
    `}>
      {children}
    </div>
  );
};