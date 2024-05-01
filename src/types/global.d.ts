export {};

declare global {
  interface Habit {
    name: string;
    emoji: string;
    occurences: string[];
  }

  interface UserHabitData {
    id: number;
    user_id: string;
    habits: Habit[];
  }
}
