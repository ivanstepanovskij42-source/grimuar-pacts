"use client"

import { useState } from "react";
import { Contract, CharacterClass } from "@/hooks/use-game-state";
import { Button } from "./ui/button";
import { Flame, Clock, XCircle, ChevronDown, ChevronUp, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ContractBoardProps {
  charClass: CharacterClass;
  contracts: Contract[];
  onComplete: (id: string) => void;
  onFail: (id: string) => void;
}

export function ContractBoard({ charClass, contracts, onComplete, onFail }: ContractBoardProps) {
  const [showContracts, setShowContracts] = useState(false);
  const activeContracts = contracts.filter(c => !c.completed).slice(0, 3);

  return (
    <div className="flex flex-col w-full border-x border-b border-white/5">
      <button 
        onClick={() => setShowContracts(!showContracts)}
        className="w-full py-5 px-4 flex items-center justify-center gap-3 bg-card/80 hover:bg-primary/10 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70 active:scale-[0.98] group relative overflow-hidden"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {showContracts ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        <span>{showContracts ? "[ СКРЫТЬ ПАКТЫ ]" : "[ КОНТРАКТЫ НЕДЕЛИ ]"}</span>
      </button>
      
      <AnimatePresence>
        {showContracts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden bg-black/60 p-6"
          >
            <div className="space-y-8">
              {activeContracts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground/30 italic text-[9px] tracking-[0.3em] uppercase">
                    Страницы пусты...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {activeContracts.map((contract) => (
                    <div 
                      key={contract.id}
                      className={cn(
                        "w-full p-5 border-l-2 transition-all relative overflow-hidden group backdrop-blur-sm",
                        contract.isBoss 
                          ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(139,0,0,0.1)]" 
                          : "border-white/10 bg-white/[0.01]"
                      )}
                    >
                      <h4 className={cn(
                        "font-headline text-lg tracking-widest uppercase font-black leading-tight mb-4",
                        contract.isBoss ? "blood-glow" : "text-foreground/90"
                      )}>
                        {contract.title}
                      </h4>
                      
                      <div className="text-[0.85rem] leading-relaxed text-foreground/70 mb-6 font-body italic text-justify">
                        {contract.description}
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col gap-1 text-[8px] font-mono tracking-widest opacity-40 uppercase">
                          <span className="flex items-center gap-2">
                            <Flame className="w-3 h-3 text-primary" /> +{contract.rewardGlory}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => onFail(contract.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground/20 hover:text-primary transition-colors hover:bg-transparent"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => onComplete(contract.id)}
                            className={cn(
                              "uppercase tracking-[0.2em] text-[8px] h-8 px-4 rounded-none font-black transition-all",
                              contract.isBoss 
                                ? "bg-primary hover:bg-red-900 shadow-[0_0_15px_rgba(139,0,0,0.3)]" 
                                : "bg-accent/20 hover:bg-accent/40 text-foreground/70 border border-white/5"
                            )}
                          >
                            ИСПОЛНИТЬ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
