'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEpicBossContractInputSchema = z.object({
  characterType: z.string(),
  currentXP: z.number(),
});

const GenerateEpicBossContractOutputSchema = z.object({
  contractTitle: z.string(),
  contractDescription: z.string(),
});

const epicBossContractPrompt = ai.definePrompt({
  name: 'epicBossContractPrompt',
  input: {schema: GenerateEpicBossContractInputSchema},
  output: {schema: GenerateEpicBossContractOutputSchema},
  prompt: `Вы — Судья Проклятых. Персонаж {{characterType}} прошел через 39 испытаний и готов к финальному прорыву.
Сгенерируйте описание для "БОСС-КОНТРАКТА: ИСПЫТАНИЕ КРОВЬЮ" на РУССКОМ ЯЗЫКЕ.

Это задание должно быть реальной "вылазкой" или экстремальным физическим достижением:
- Например: пробежать марафон, совершить восхождение, установить личный рекорд в весе или выполнить сверхчеловеческий объем работы за раз.
- Опишите это как великое сражение, решающее судьбу персонажа и его право носить ранг Наемника.`,
});

export async function generateEpicBossContract(input: any) {
  const {output} = await epicBossContractPrompt(input);
  return output!;
}
