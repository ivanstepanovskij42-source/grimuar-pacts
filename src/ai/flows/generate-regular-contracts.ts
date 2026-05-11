'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRegularContractsInputSchema = z.object({
  characterRole: z.enum(['Warrior', 'Shinobi']),
});
export type GenerateRegularContractsInput = z.infer<typeof GenerateRegularContractsInputSchema>;

const GeneratedContractPartSchema = z.object({
  title: z.string().describe('Название контракта на РУССКОМ языке.'),
  description: z.string().describe('Описание контракта на РУССКОМ языке.'),
});

const GenerateRegularContractsOutputSchema = z.object({
  contracts: z.array(GeneratedContractPartSchema).length(3),
});
export type GenerateRegularContractsOutput = z.infer<typeof GenerateRegularContractsOutputSchema>;

const generateRegularContractsPrompt = ai.definePrompt({
  name: 'generateRegularContractsPrompt',
  input: {schema: GenerateRegularContractsInputSchema},
  output: {schema: GenerateRegularContractsOutputSchema},
  prompt: `Вы — Мастер Теней в мире Dark Fantasy. Сгенерируйте 3 суровых тренировочных контракта для персонажа класса {{characterRole}}. 
ВСЕ ТЕКСТЫ ДОЛЖНЫ БЫТЬ НА РУССКОМ ЯЗЫКЕ.

Для Воина (Warrior): 
- Используйте названия: "Истязание сталью" (силовая тренировка), "Марш в доспехах" (кардио/ходьба), "Кузница мышц" (базовые упражнения).
- Описания должны быть мрачными, связанными с закалкой плоти и тяжестью металла.

Для Шиноби (Shinobi):
- Используйте названия: "Теневой шаг" (бег/прыжки), "Дыхание безмолвия" (растяжка/йога), "Статика пустоты" (планка/баланс).
- Описания должны быть о ловкости, невидимости и контроле над телом в тишине.

Character Role: {{{characterRole}}}`,
});

export async function generateRegularContracts(input: GenerateRegularContractsInput): Promise<GenerateRegularContractsOutput> {
  const {output} = await generateRegularContractsPrompt(input);
  return output!;
}
