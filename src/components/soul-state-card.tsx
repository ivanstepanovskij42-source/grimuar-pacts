"use client"

import { IronFrame } from "./ui/iron-frame";
import { Progress } from "./ui/progress";
import { CharacterStats } from "@/hooks/use-game-state";
import { Skull, Target } from "lucide-react";

interface SoulStateCardProps {
  stats: CharacterStats;
}

export function SoulStateCard({ stats }: SoulStateCardProps) {
  const threshold = 100000;
  const progress = Math.min((stats.glory / threshold) * 100, 100);

  return (
    <IronFrame title="СОСТОЯНИЕ ДУШИ" className="bg-black/20 border-white/5">
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-30">Слава</span>
            <span className="text-3xl font-bold text-foreground/90 tracking-tighter">{stats.glory.toLocaleString()}</span>
          </div>
          <span className="text-[9px] opacity-30 uppercase tracking-widest">Цель: {threshold.toLocaleString()} XP</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] opacity-50">
            <span className="flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Прогресс Пактов</span>
            <span>{stats.contracts.filter(c => c.completed).length} / 40</span>
          </div>
          <Progress value={progress} className="h-1 bg-black/60 rounded-none" />
        </div>
        
        <div className="flex items-center gap-4 bg-red-950/20 p-4 border border-primary/20">
          <Skull className="w-6 h-6 text-primary/60" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40">Метки Позора</span>
            <span className="font-bold text-primary tracking-widest">{stats.marksOfShame} / 3</span>
          </div>
        </div>
      </div>
    </IronFrame>
  );
}
