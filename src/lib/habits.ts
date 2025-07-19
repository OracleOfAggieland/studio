import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Habit } from '@/types';

const habitsRef = collection(db, 'habits');

export async function fetchHabits(): Promise<Habit[]> {
  const snap = await getDocs(habitsRef);
  return snap.docs.map(d => d.data() as Habit);
}

export async function saveHabit(habit: Habit): Promise<void> {
  await setDoc(doc(habitsRef, habit.id), habit);
}

export async function updateHabit(habit: Habit): Promise<void> {
  await setDoc(doc(habitsRef, habit.id), habit);
}

export async function resetHabitStreak(id: string): Promise<void> {
  await updateDoc(doc(habitsRef, id), { streak: 0, completions: {} });
}
