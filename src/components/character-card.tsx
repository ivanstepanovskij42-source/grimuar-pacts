"use client"

import { useState } from "react";
import { IronFrame } from "./ui/iron-frame";
import { Progress } from "./ui/progress";
import { CharacterStats, CharacterAttributes, CharacterClass } from "@/hooks/use-game-state";
import { Badge } from "./ui/badge";
import { Sword, Wind, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import wariorImg from '@/public/warior.jpg';
import shinobiImg from '@/public/shinobi.jpg';

interface CharacterCardProps {
  stats: CharacterStats;
  onIncreaseAttribute: (charClass: CharacterClass, attr: keyof CharacterAttributes) => void;
}

const ATTRIBUTE_LABELS: Record<keyof CharacterAttributes, string> = {
  health: "Здоровье",
  endurance: "Выносливость",
  strength: "Сила",
  agility: "Ловкость",
  intelligence: "Интеллект",
  luck: "Удача",
  stealth: "Скрытность",
  resilience: "Стойкость",
  rage: "Ярость",
  speed: "Скорость",
};

export function CharacterCard({ stats, onIncreaseAttribute }: CharacterCardProps) {
  const [showAttributes, setShowAttributes] = useState(false);
  const threshold = 100000;
  const rankName = stats.glory >= threshold ? "НАЕМНИК (E)" : "РЕКРУТ (F)";
  
  const classInfo = {
    'Воин': {
      desc: "Закаленный в битвах мастер стали",
      icon: <Sword className="w-6 h-6" />,
      img: wariorImg
    },
    'Шиноби': {
      desc: "Тень, несущая смерть в тишине",
      icon: <Wind className="w-6 h-6" />,
      img: shinobiImg
    }
  }[stats.class];

  return (
    <div className="flex flex-col w-full">
      <IronFrame className="aspect-[3/4] overflow-hidden p-0 bg-black mb-0">
        <div className="relative w-full h-full group">
          <Image 
            src={classInfo.img} 
            alt={stats.class} 
            fill
            className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-black text-primary flex items-center gap-3 blood-glow">
                {classInfo.icon}
                {stats.class}
              </h1>
              <Badge variant="outline" className="border-primary/50 text-primary bg-black/60 text-[9px] tracking-widest px-2 py-0.5">
                {rankName}
              </Badge>
            </div>
            <p className="text-[9px] italic text-foreground/50 tracking-widest uppercase">{classInfo.desc}</p>
          </div>
        </div>
      </IronFrame>

      <button 
        onClick={() => setShowAttributes(!showAttributes)}
        className="w-full py-5 px-4 flex items-center justify-center gap-3 border-x border-b border-white/5 bg-card/60 hover:bg-primary/10 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70 active:scale-[0.98] group relative z-20"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
        }}
      >
        {showAttributes ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        {showAttributes ? "[ СКРЫТЬ АТРИБУТЫ ]" : "[ ПОКАЗАТЬ АТРИБУТЫ ]"}
      </button>

      <AnimatePresence>
        {showAttributes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden bg-black/40 border-x border-b border-white/5 p-6"
          >
            <div className="space-y-6">
              <div className="text-center">
                <span className={cn(
                  "text-[9px] uppercase tracking-[0.3em] font-black transition-all",
                  stats.skillPoints > 0 ? "blood-glow animate-pulse" : "text-foreground/30"
                )}>
                  Очки Судьбы: {stats.skillPoints}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(Object.keys(ATTRIBUTE_LABELS) as Array<keyof CharacterAttributes>).map((attr) => (
                  <div key={attr} className="space-y-1.5 bg-white/[0.02] p-2.5 border border-white/[0.03] group relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-foreground/70">
                        {ATTRIBUTE_LABELS[attr]}: {stats.attributes[attr]}
                      </span>
                      <button 
                        type="button"
                        onClick={() => onIncreaseAttribute(stats.class, attr)}
                        disabled={stats.skillPoints <= 0}
                        className={cn(
                          "w-5 h-5 flex items-center justify-center border transition-all",
                          stats.skillPoints > 0 
                            ? "border-primary text-primary hover:bg-primary hover:text-white cursor-pointer shadow-[0_0_8px_rgba(139,0,0,0.3)]" 
                            : "border-white/5 text-white/5 cursor-not-allowed"
                        )}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <Progress 
                      value={Math.min(stats.attributes[attr] * 5, 100)} 
                      className="h-[1px] bg-black/60 rounded-none overflow-hidden" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
