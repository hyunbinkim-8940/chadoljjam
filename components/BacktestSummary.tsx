import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Sparkles, Trash2, RotateCcw, TrendingUp } from 'lucide-react';
import { SimulationSlot, SimulationResult } from '../types';
import { WeightSlider } from './WeightSlider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BacktestSummaryProps {
    slots: SimulationSlot[];
    setSlots: React.Dispatch<React.SetStateAction<SimulationSlot[]>>;
    onRunSimulation: (capital: number, asset: 'ATOM' | 'ATOMONE') => void;
    simulationResult: SimulationResult | null;
    isSimulating: boolean;
    onResetSimulation: () => void;
}

export const BacktestSummary: React.FC<BacktestSummaryProps> = ({ 
    slots, 
    setSlots, 
    onRunSimulation, 
    simulationResult,
    isSimulating,
    onResetSimulation
}) => {
    const [capital, setCapital] = useState(100);
    const [asset, setAsset] = useState<'ATOM' | 'ATOMONE'>('ATOM');

    // Derived from slots
    const weights: [number, number, number] = [slots[0].weight, slots[1].weight, slots[2].weight];

    const handleWeightChange = (newWeights: [number, number, number]) => {
        setSlots(prev => prev.map((slot, i) => ({ ...slot, weight: newWeights[i] })));
    };

    const handleClearSlot = (index: number) => {
        setSlots(prev => {
            const next = [...prev];
            next[index] = { ...next[index], account: null };
            return next;
        });
    };

    const isReady = slots.filter(s => s.account !== null).length >= 2 && capital >= 100;

    // Slot Card Component
    const SlotCard = ({ slot, index }: { slot: SimulationSlot, index: number }) => {
        const colors = [
            { bg: 'bg-indigo-50 border-indigo-200', icon: 'bg-indigo-500', text: 'text-indigo-600', glow: 'shadow-indigo-100' }, // A
            { bg: 'bg-pink-50 border-pink-200', icon: 'bg-pink-500', text: 'text-pink-600', glow: 'shadow-pink-100' },     // B
            { bg: 'bg-emerald-50 border-emerald-200', icon: 'bg-emerald-500', text: 'text-emerald-600', glow: 'shadow-emerald-100' } // C
        ];
        const style = colors[index];

        return (
            <div className={`relative ${style.bg} rounded-2xl px-4 py-3 flex justify-between items-center border ${style.glow} shadow-sm h-16 transition-all hover:bg-white group min-w-0`}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                     <div className={`w-8 h-8 rounded-lg ${style.icon} shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                         {slot.id}
                     </div>
                     {slot.account ? (
                         <div className="flex flex-col min-w-0 flex-1">
                             <span className="font-bold text-slate-800 text-sm truncate">{slot.account.name}</span>
                             <span className="text-[10px] text-slate-500 truncate">{slot.account.chain}</span>
                         </div>
                     ) : (
                         <span className="text-sm text-slate-400 italic whitespace-nowrap">Empty Slot</span>
                     )}
                </div>
                
                <div className="flex items-center gap-4 shrink-0 pl-2">
                    <span className={`font-bold text-base ${style.text}`}>{Math.round(slot.weight)}%</span>
                    {slot.account && !simulationResult && (
                        <button 
                            onClick={() => handleClearSlot(index)} 
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex gap-6 h-[420px] shrink-0 min-w-0">
            {/* Left: Configuration & Slots */}
            <GlassCard className={`flex-[1.5] min-w-0 flex gap-5 transition-opacity duration-300 ${simulationResult ? 'opacity-40 pointer-events-none grayscale-[0.5]' : ''}`} padding="p-6">
                {/* Sliders Area */}
                <div className="flex flex-col items-center justify-between h-full py-1 shrink-0">
                    <div className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Weight</div>
                    <div className="h-full flex-1 py-2">
                        <WeightSlider weights={weights} onChange={handleWeightChange} disabled={!!simulationResult} />
                    </div>
                </div>

                {/* Slots List & Input */}
                <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                        <h3 className="text-slate-500 font-semibold tracking-[0.2em] text-xs mb-2 uppercase" style={{ fontFamily: 'Space Grotesk' }}>PORTFOLIO COMPOSITION</h3>
                        {slots.map((slot, i) => (
                            <SlotCard key={slot.id} slot={slot} index={i} />
                        ))}
                    </div>

                    {/* Bottom Inputs */}
                    <div className="flex items-center gap-4 mt-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto custom-scrollbar shadow-inner">
                        <div className="flex items-center gap-3 pl-1 shrink-0">
                            {/* Removed Label */}
                            <input 
                                type="number" 
                                value={capital}
                                onChange={(e) => setCapital(Number(e.target.value))}
                                min={100}
                                placeholder="100"
                                className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-center placeholder-slate-400 shadow-sm"
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-200 shrink-0"></div>
                        <div className="flex items-center gap-3 shrink-0">
                             {/* Removed Label */}
                             <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                                 <button 
                                    onClick={() => setAsset('ATOM')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                        asset === 'ATOM' 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                 >
                                     ATOM
                                 </button>
                                 <button 
                                    onClick={() => setAsset('ATOMONE')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                        asset === 'ATOMONE' 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                 >
                                     ATOMONE
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Right: Simulation Action / Result */}
            <GlassCard className="flex-[2] min-w-0 relative overflow-hidden group border-white/60" padding="p-0">
                {!simulationResult ? (
                    // PRE-SIMULATION STATE
                    <div 
                        onClick={() => isReady && onRunSimulation(capital, asset)}
                        className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative ${isReady ? 'hover:bg-indigo-50/50' : 'opacity-70 cursor-not-allowed'}`}
                    >
                         {/* Background glowing effect for button */}
                         {isReady && <div className="absolute inset-0 bg-gradient-to-t from-indigo-100/30 to-transparent pointer-events-none" />}
                         
                         {isSimulating ? (
                             <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-[5px] border-indigo-600 border-t-transparent shadow-[0_0_20px_rgba(79,70,229,0.2)]"></div>
                                <p className="text-indigo-600 text-sm mt-6 font-bold animate-pulse tracking-widest">RUNNING SIMULATION...</p>
                             </div>
                         ) : (
                             <>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 ${isReady ? 'group-hover:scale-110 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg text-white' : 'bg-slate-100 grayscale border border-slate-200'}`}>
                                    <Sparkles className={`${isReady ? 'text-white' : 'text-slate-400'} w-10 h-10 drop-shadow-md`} />
                                </div>
                                <h2 className={`text-3xl font-bold mb-3 ${isReady ? 'text-slate-800' : 'text-slate-400'}`}>Run Simulation</h2>
                                <p className="text-slate-500 text-base font-light text-center px-4">
                                    {isReady ? 'Click to generate backtest results' : 'Add at least 2 nodes & set capital > 100'}
                                </p>
                             </>
                         )}
                    </div>
                ) : (
                    // RESULT STATE
                    <div className="w-full h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/40">
                        <div className="flex justify-between items-start mb-4 shrink-0">
                            <div>
                                <h3 className="text-indigo-600 font-bold tracking-[0.2em] text-xs mb-1 uppercase" style={{ fontFamily: 'Space Grotesk' }}>Simulation Result</h3>
                                <p className="text-sm text-slate-500">Strategy based on {asset} accumulation</p>
                            </div>
                            <button onClick={onResetSimulation} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-700 transition-colors bg-white/40 border border-white/60 shadow-sm">
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <div className="flex gap-4 mb-4 shrink-0">
                             {/* Key Metrics Cards */}
                             <div className="flex-1 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 relative overflow-hidden group/card shadow-sm">
                                 <div className="absolute inset-0 bg-emerald-100/20 group-hover/card:bg-emerald-100/40 transition-colors"></div>
                                 <p className="text-xs text-emerald-600 font-bold uppercase mb-1 relative z-10">Total PnL</p>
                                 <p className="text-2xl font-bold text-emerald-700 relative z-10 drop-shadow-sm truncate">+{simulationResult.totalPnL.toFixed(2)}</p>
                                 <p className="text-[10px] text-emerald-600/60 relative z-10 font-mono mt-0.5">{asset}</p>
                             </div>
                             <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden group/card shadow-sm">
                                 <div className="absolute inset-0 bg-indigo-100/20 group-hover/card:bg-indigo-100/40 transition-colors"></div>
                                 <p className="text-xs text-indigo-600 font-bold uppercase mb-1 relative z-10">ROI</p>
                                 <p className="text-2xl font-bold text-indigo-700 relative z-10 drop-shadow-sm truncate">+{simulationResult.roi.toFixed(1)}%</p>
                                 <p className="text-[10px] text-indigo-600/60 relative z-10 font-mono mt-0.5">RETURN</p>
                             </div>
                             <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Final Value</p>
                                 <p className="text-2xl font-bold text-slate-800 truncate">{simulationResult.finalValue.toFixed(0)}</p>
                                 <p className="text-[10px] text-slate-400 font-mono mt-0.5">TOKENS</p>
                             </div>
                        </div>

                        {/* Line Chart */}
                        <div className="flex-1 w-full min-h-0 bg-white/60 rounded-2xl border border-white/60 p-2 pb-0 overflow-hidden shadow-sm">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulationResult.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', color: '#1e293b' }}
                                        labelStyle={{ fontSize: '11px', color: '#64748b' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#6366f1' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                    <Area type="monotone" dataKey="benchmark" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};