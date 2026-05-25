import React, { useState, useEffect } from "react";
import { X, Zap, Check, Loader2, Sparkles, Receipt, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface CreditLog {
  id: string;
  action: string;
  amount: number;
  date: string;
}

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCredits: number) => void;
}

export function CreditsModal({ isOpen, onClose, onSuccess }: CreditsModalProps) {
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<CreditLog[]>([]);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCredits();
    }
  }, [isOpen]);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCredits(data.aiCredits);
      setHistory(data.history || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load AI credit details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planName: string, amount: number) => {
    setIsUpgrading(planName);
    try {
      const res = await fetch("/api/credits/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName, credits: amount })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setCredits(data.aiCredits);
      onSuccess(data.aiCredits);
      toast.success(`Successfully upgraded to ${planName}! +${amount} credits added.`);
      fetchCredits();
    } catch (err: any) {
      console.error(err);
      toast.error("Upgrade checkout failed");
    } finally {
      setIsUpgrading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-950 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Left column: Plans and purchase */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-r border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-100" />
                AI Credits & Upgrade
              </h2>
              <p className="text-sm text-slate-500 mt-1">Unlock professional AI capabilities and ATS optimization</p>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Current Balance</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{credits} AI Credits</div>
              </div>
            </div>
            {credits < 3 && (
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">Low Credits Warning</span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Premium Plans</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Pro Plan */}
              <div className="relative rounded-2xl border-2 border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 p-5 flex flex-col justify-between">
                <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Pro Plan</h4>
                  <p className="text-xs text-slate-550 mt-1">Excellent for active job seekers</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">$9</span>
                    <span className="text-xs text-slate-500">/ one-time</span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    +50 AI Credits Included
                  </div>
                </div>
                <button 
                  disabled={isUpgrading !== null}
                  onClick={() => handleUpgrade("Pro Plan", 50)}
                  className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUpgrading === "Pro Plan" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Stripe Checkout"
                  )}
                </button>
              </div>

              {/* Elite Plan */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between bg-card hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Elite Plan</h4>
                  <p className="text-xs text-slate-550 mt-1">Ultimate power for premium applications</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">$19</span>
                    <span className="text-xs text-slate-500">/ one-time</span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    +150 AI Credits Included
                  </div>
                </div>
                <button 
                  disabled={isUpgrading !== null}
                  onClick={() => handleUpgrade("Elite Plan", 150)}
                  className="w-full mt-5 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUpgrading === "Elite Plan" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Stripe Checkout"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Premium Features Included</h4>
              <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited resume PDF downloads</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Professional template collection</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant dynamic AI suggestions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> One-click cover letter writer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: Credits usage logs */}
        <div className="w-full md:w-[350px] bg-slate-50 dark:bg-slate-900/60 p-6 md:p-8 flex flex-col max-h-full">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Receipt className="w-4.5 h-4.5 text-slate-400" />
              Usage History
            </h3>
            <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500">Loading history...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500">No transaction logs available.</p>
              </div>
            ) : (
              history.map((log) => (
                <div key={log.id} className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className={`font-bold shrink-0 ${log.amount > 0 ? "text-emerald-500" : "text-slate-600 dark:text-slate-400"}`}>
                    {log.amount > 0 ? `+${log.amount}` : log.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
