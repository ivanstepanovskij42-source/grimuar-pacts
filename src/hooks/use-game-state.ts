"use client"

import { useState, useEffect, useCallback } from 'react';
import { generateEpicBossContract } from '@/ai/flows/generate-epic-boss-contract';
import { WARRIOR_TITLES, SHINOBI_TITLES, WARRIOR_DESCRIPTIONS, SHINOBI_DESCRIPTIONS } from '@/lib/contracts-registry';

export type CharacterClass = 'Воин' | 'Шиноби';

export interface Contract {
  id: string;
  title: string;
  description: string;
  rewardGlory: number;
  rewardSkillPoints: number;
  deadline: string;
  isBoss: boolean;
  completed: boolean;
  createdAt: string;
}

export interface CharacterAttributes {
  health: number;
  endurance: number;
  strength: number;
  agility: number;
  intelligence: number;
  luck: number;
  stealth: number;
  resilience: number;
  rage: number;
  speed: number;
}

export interface CharacterStats {
  class: CharacterClass;
  glory: number;
  marksOfShame: number;
  contracts: Contract[];
  lastGeneratedDate: string | null;
  skillPoints: number;
  attributes: CharacterAttributes;
}

const GLORY_THRESHOLD_RANK_E = 100000;
const REWARD_GLORY_PER_TASK = 2500;
const REWARD_SKILL_POINTS_PER_TASK = 5;
const REWARD_SKILL_POINTS_BOSS = 50;
const BOSS_TRIGGER_XP = 97500;

const DEFAULT_ATTRIBUTES: CharacterAttributes = {
  health: 0,
  endurance: 0,
  strength: 0,
  agility: 0,
  intelligence: 0,
  luck: 0,
  stealth: 0,
  resilience: 0,
  rage: 0,
  speed: 0,
};

const INITIAL_STATS: Record<CharacterClass, CharacterStats> = {
  'Воин': {
    class: 'Воин',
    glory: 0,
    marksOfShame: 0,
    contracts: [],
    lastGeneratedDate: null,
    skillPoints: 0, // СТРОГО 0 ПРИ СТАРТЕ
    attributes: { ...DEFAULT_ATTRIBUTES },
  },
  'Шиноби': {
    class: 'Шиноби',
    glory: 0,
    marksOfShame: 0,
    contracts: [],
    lastGeneratedDate: null,
    skillPoints: 0, // СТРОГО 0 ПРИ СТАРТЕ
    attributes: { ...DEFAULT_ATTRIBUTES },
  },
};

const ACTIVE_CLASS_KEY = 'grim_selected_path';
const USER_NAME_KEY = 'user_name';

export function useGameState() {
  const [stats, setStats] = useState<Record<CharacterClass, CharacterStats>>(INITIAL_STATS);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY);
    const savedClass = localStorage.getItem(ACTIVE_CLASS_KEY) as CharacterClass | null;
    
    const warriorData = localStorage.getItem('stats_warior');
    const shinobiData = localStorage.getItem('stats_shinobi');

    const loadedStats = {
      'Воин': warriorData ? JSON.parse(warriorData) : INITIAL_STATS['Воин'],
      'Шиноби': shinobiData ? JSON.parse(shinobiData) : INITIAL_STATS['Шиноби'],
    };

    setStats(loadedStats);
    if (savedName) setUserName(savedName);
    if (savedClass && (savedClass === 'Воин' || savedClass === 'Шиноби')) {
      setSelectedClass(savedClass);
    }
    
    setIsLoaded(true);
  }, []);

  // Синхронизация с localStorage только для текущего класса
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('stats_warior', JSON.stringify(stats['Воин']));
    localStorage.setItem('stats_shinobi', JSON.stringify(stats['Шиноби']));
  }, [stats, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (userName) localStorage.setItem(USER_NAME_KEY, userName);
    if (selectedClass) localStorage.setItem(ACTIVE_CLASS_KEY, selectedClass);
  }, [selectedClass, userName, isLoaded]);

  const selectPath = (path: CharacterClass) => {
    setSelectedClass(path);
  };

  const resetPath = () => {
    setSelectedClass(null);
  };

  const saveUserName = (name: string) => {
    setUserName(name);
  };

  const generateNewContracts = useCallback(async (charClass: CharacterClass) => {
    const charStats = stats[charClass];
    const isBossEligible = charStats.glory >= BOSS_TRIGGER_XP && charStats.glory < GLORY_THRESHOLD_RANK_E;

    let newContracts: Contract[] = [];

    if (isBossEligible) {
      const boss = await generateEpicBossContract({
        characterType: charClass === 'Воин' ? 'Warrior' : 'Shinobi',
        currentXP: charStats.glory
      });
      newContracts = [{
        id: Math.random().toString(36).substr(2, 9),
        title: "БОСС-КОНТРАКТ: ИСПЫТАНИЕ КРОВЬЮ",
        description: boss.contractDescription,
        rewardGlory: REWARD_GLORY_PER_TASK,
        rewardSkillPoints: REWARD_SKILL_POINTS_BOSS,
        deadline: 'Воскресенье 23:59',
        isBoss: true,
        completed: false,
        createdAt: new Date().toISOString()
      }];
    } else {
      const titles = charClass === 'Воин' ? WARRIOR_TITLES : SHINOBI_TITLES;
      const descs = charClass === 'Воин' ? WARRIOR_DESCRIPTIONS : SHINOBI_DESCRIPTIONS;
      const selectedTitles = [...titles].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      newContracts = selectedTitles.map(title => ({
        id: Math.random().toString(36).substr(2, 9),
        title: title.toUpperCase(),
        description: descs[Math.floor(Math.random() * descs.length)],
        rewardGlory: REWARD_GLORY_PER_TASK,
        rewardSkillPoints: REWARD_SKILL_POINTS_PER_TASK,
        deadline: 'Воскресенье 23:59',
        isBoss: false,
        completed: false,
        createdAt: new Date().toISOString()
      }));
    }

    setStats(prev => ({
      ...prev,
      [charClass]: {
        ...prev[charClass],
        contracts: [...prev[charClass].contracts, ...newContracts],
        lastGeneratedDate: new Date().toDateString()
      }
    }));
  }, [stats]);

  useEffect(() => {
    if (!isLoaded || !selectedClass) return;
    const now = new Date();
    const day = now.getDay(); 
    const dateStr = now.toDateString();
    const generationDays = [1, 3, 5];
    
    if (generationDays.includes(day)) {
      if (stats[selectedClass].lastGeneratedDate !== dateStr && stats[selectedClass].contracts.length === 0) {
        generateNewContracts(selectedClass);
      }
    }
  }, [isLoaded, selectedClass, stats, generateNewContracts]);

  const completeContract = (charClass: CharacterClass, contractId: string) => {
    setStats(prev => {
      const char = prev[charClass];
      const contract = char.contracts.find(c => c.id === contractId);
      if (!contract || contract.completed) return prev;

      const newContracts = char.contracts.map(c => 
        c.id === contractId ? { ...c, completed: true } : c
      );

      return {
        ...prev,
        [charClass]: {
          ...char,
          glory: char.glory + contract.rewardGlory,
          skillPoints: char.skillPoints + contract.rewardSkillPoints,
          contracts: newContracts
        }
      };
    });
  };

  const failContract = (charClass: CharacterClass, contractId: string) => {
    setStats(prev => {
      const char = prev[charClass];
      let newMarks = char.marksOfShame + 1;
      let newGlory = char.glory;

      if (newMarks >= 3) {
        newGlory = Math.max(0, char.glory - 5000);
        newMarks = 0;
      }

      return {
        ...prev,
        [charClass]: {
          ...char,
          glory: newGlory,
          marksOfShame: newMarks,
          contracts: char.contracts.filter(c => c.id !== contractId)
        }
      };
    });
  };

  const increaseAttribute = (charClass: CharacterClass, attrName: keyof CharacterAttributes) => {
    setStats(prev => {
      const char = prev[charClass];
      if (char.skillPoints <= 0) return prev;

      return {
        ...prev,
        [charClass]: {
          ...char,
          skillPoints: char.skillPoints - 1,
          attributes: {
            ...char.attributes,
            [attrName]: char.attributes[attrName] + 1
          }
        }
      };
    });
  };

  return {
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
  };
}
