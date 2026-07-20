export type TaskType = 'course' | 'trade';

export interface DayProgress {
  [day: number]: boolean[];
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  days: number;
  cellsPerDay: number;
  dailyTarget: number | null;
  progress: DayProgress;
  createdAt: number;
}

export interface CreateTaskInput {
  name: string;
  type: TaskType;
  days: number;
  perDay?: number;
  dailyTarget?: number;
}

export interface DayStats {
  done: number;
  total: number;
  complete: boolean;
}

export interface TaskStats {
  done: number;
  total: number;
  pct: number;
  doneDays: number;
}
