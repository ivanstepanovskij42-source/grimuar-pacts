"use client"

import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { CharacterCard } from "@/components/character-card";
import { ContractBoard } from "@/components/contract-board";
import { SoulStateCard } from "@/components/soul-state-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { IronFrame } from "@/components/ui/iron-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sword, Ghost, Scroll, RefreshCcw } from "lucide-react";
import Image from "next/image";

import wariorImg from '@/public/warior.jpg';
import shinobiImg from '@/public/shinobi.jpg';

export default function Home() {
  const { 
    stats, 
    selectedClass, 
    userName, 
    isLoaded, 
    completeContract, 
    failContract, 
    selectPath, 
    resetPath, 
    saveUserName,
    increaseAttribute 
  } = useGameState();
  
  const [nameInput, setNameInput] = useState("");

  const handleComplete = (id: string) => {
    if (selectedClass) completeContract(selectedClass, id);
  };

  const handleFail = (id: string) => {
    if (selectedClass) failContract(selectedClass, id);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      saveUserName(nameInput.trim());
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col gap-8 items-center justify-center">
        <Skeleton className="h-12 w-64 bg-primary/10" />
        <Skeleton className="h-[400px] w-full max-w-md bg-white/5" />
      </div>
    );
  }

  if (!userName) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative z-10">
        <IronFrame className="max-w-md w-full py-16 px-10 text-center bg-card/60">
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] text-primary mb-10 leading-tight blood-glow">
            ПАКТ КРОВИ
          </h1>
          <form onSubmit={handleNameSubmit} className="space-y-10">
            <div className="relative">
              <Input 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Твое имя..."
                className="bg-transparent border-0 border-b border-primary/20 rounded-none text-center text-xl text-foreground focus-visible:ring-0 focus-visible:border-primary caret-primary h-14 placeholder:text-foreground/10"
                autoFocus
              />
            </div>
            <Button 
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full bg-primary/10 hover:bg-primary text-primary-foreground border border-primary/30 rounded-none py-8 uppercase tracking-[0.4em] font-black transition-all duration-500 shadow-2xl"
            >
              ПРИНЯТЬ СУДЬБУ
            </Button>
          </form>
        </IronFrame>
      </main>
    );
  }

  if (!selectedClass) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative z-10">
        <header className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-[0.3em] text-primary mb-6 blood-glow">
            ВЫБОР ПУТИ
          </h1>
          <p className="text-foreground/40 italic font-headline uppercase tracking-[0.5em] text-[10px]">
            "{userName}, Твоя кровь — это чернила для этого Гримуара"
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full">
          <div className="group cursor-pointer" onClick={() => selectPath('Воин')}>
            <IronFrame className="h-full hover:border-primary transition-all duration-1000 overflow-hidden p-0 bg-black shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Image 
                  src={wariorImg} 
                  alt="Воин" 
                  fill
                  className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h2 className="text-4xl font-black text-primary flex items-center gap-4 mb-4 blood-glow">
                    <Sword className="w-10 h-10" /> ВОИН
                  </h2>
                  <p className="text-[10px] italic text-foreground/40 leading-relaxed tracking-widest uppercase mb-6">
                    Путь Стали и Боли. Твое тело — бастион ярости.
                  </p>
                  <Button className="w-full bg-primary/20 hover:bg-primary text-primary-foreground rounded-none uppercase tracking-[0.3em] text-[10px] h-12 border border-primary/40">
                    ИЗБРАТЬ ПУТЬ
                  </Button>
                </div>
              </div>
            </IronFrame>
          </div>

          <div className="group cursor-pointer" onClick={() => selectPath('Шиноби')}>
            <IronFrame className="h-full hover:border-primary transition-all duration-1000 overflow-hidden p-0 bg-black shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Image 
                  src={shinobiImg} 
                  alt="Шиноби" 
                  fill
                  className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h2 className="text-4xl font-black text-primary flex items-center gap-4 mb-4 blood-glow">
                    <Ghost className="w-10 h-10" /> ШИНОБИ
                  </h2>
                  <p className="text-[10px] italic text-foreground/40 leading-relaxed tracking-widest uppercase mb-6">
                    Путь Тени и Безмолвия. Твое оружие — мрак.
                  </p>
                  <Button className="w-full bg-primary/20 hover:bg-primary text-primary-foreground rounded-none uppercase tracking-[0.3em] text-[10px] h-12 border border-primary/40">
                    ИЗБРАТЬ ПУТЬ
                  </Button>
                </div>
              </div>
            </IronFrame>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 relative z-10">
      <header className="relative py-12 text-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.4em] text-primary blood-glow">
            СУМЕРЕЧНЫЙ ГРИМУАР
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 mt-6 px-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/30 italic font-bold">
                {selectedClass === 'Воин' ? "ПУТЬ СТАЛИ" : "ПУТЬ ТЕНИ"}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetPath}
                className="h-8 text-[9px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary hover:bg-white/5 flex items-center gap-2"
              >
                <RefreshCcw className="w-3 h-3" /> ОТРЕЧЕНИЕ
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Стек управления (Левая панель) */}
          <div className="lg:col-span-4 flex flex-col gap-0">
            {/* Группа 1: Фото + Атрибуты */}
            <CharacterCard 
              stats={stats[selectedClass]} 
              onIncreaseAttribute={increaseAttribute}
            />
            
            {/* Группа 2: Контракты */}
            <ContractBoard 
              charClass={selectedClass} 
              contracts={stats[selectedClass].contracts} 
              onComplete={handleComplete} 
              onFail={handleFail}
            />

            {/* Группа 3: Состояние души */}
            <div className="mt-8">
              <SoulStateCard stats={stats[selectedClass]} />
            </div>

            <Button 
              type="button"
              variant="ghost"
              onClick={() => {
                const storageKey = selectedClass === 'Воин' ? 'stats_warior' : 'stats_shinobi';
                localStorage.removeItem(storageKey);
                localStorage.removeItem('grim_selected_path');
                localStorage.removeItem('user_name');
                window.location.href = '/';
              }}
              className="mt-8 w-full py-6 bg-black/40 text-muted-foreground/40 border border-white/5 hover:bg-red-950/40 hover:text-primary-foreground hover:border-primary/50 transition-all duration-500 uppercase tracking-[0.4em] text-[9px] font-bold rounded-none"
            >
              ОТРЕЧЬСЯ ОТ ПУТИ
            </Button>
          </div>

          {/* Правая панель (Декоративная/Информационная) */}
          <div className="lg:col-span-8 relative min-h-[600px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Image 
                src={selectedClass === 'Воин' ? wariorImg : shinobiImg} 
                alt="Background Art" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10 max-w-xl text-center space-y-10 px-12">
              <Scroll className="w-16 h-16 text-primary mx-auto opacity-20" />
              <div className="space-y-6">
                <p className="text-xl md:text-2xl font-headline italic text-foreground/40 leading-relaxed text-justify">
                  {selectedClass === 'Воин' 
                    ? "«Сталь не задает вопросов. Она лишь забирает то, что ей обещано. Твое тело — молот, твоя воля — наковальня.»"
                    : "«Тень — это не отсутствие света, а его истинная форма. Безмолвие громче любого крика, а пустота тяжелее любого клинка.»"
                  }
                </p>
                <div className="w-24 h-px bg-primary/30 mx-auto" />
                <span className="block text-[10px] uppercase tracking-[0.6em] text-primary/40 font-black">
                  Судьба {userName} предрешена
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 opacity-20 text-center py-12">
        <div className="flex justify-center items-center gap-4 text-[9px] uppercase tracking-[0.8em] text-foreground">
          <Scroll className="w-4 h-4" />
          <span>ЭПОХА ПЕПЛА • ММXXIV</span>
        </div>
      </footer>
      <Toaster />
    </main>
  );
}
