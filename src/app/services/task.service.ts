import { Injectable, signal } from '@angular/core';
import { CreateTaskInput, DayStats, Task, TaskStats } from '../models/task.model';
import { DOLLAR_STEP } from '../theme/theme.constants';

const STORAGE_KEY = 'tapsiriq_izleyici_tasks_v1';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>(this.loadFromStorage());

  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
    } catch {
      // localStorage əlçatan deyilsə sakitcə keç
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  createTask(input: CreateTaskInput): Task {
    const cellsPerDay = input.type === 'course'
      ? Math.max(1, input.perDay ?? 1)
      : Math.round((input.dailyTarget ?? DOLLAR_STEP) / DOLLAR_STEP);

    const progress: Task['progress'] = {};
    for (let day = 1; day <= input.days; day++) {
      progress[day] = new Array(cellsPerDay).fill(false);
    }

    const task: Task = {
      id: this.generateId(),
      name: input.name.trim() || (input.type === 'course' ? 'Kurs tapşırığı' : 'Treyd hədəfi'),
      type: input.type,
      days: input.days,
      cellsPerDay,
      dailyTarget: input.type === 'trade' ? (input.dailyTarget ?? DOLLAR_STEP) : null,
      progress,
      createdAt: Date.now()
    };

    this.tasks.update(list => [task, ...list]);
    this.persist();
    return task;
  }

  deleteTask(id: string): void {
    this.tasks.update(list => list.filter(t => t.id !== id));
    this.persist();
  }

  toggleCell(taskId: string, day: number, index: number): void {
    this.tasks.update(list => list.map(task => {
      if (task.id !== taskId) return task;
      const dayCells = [...(task.progress[day] ?? [])];
      dayCells[index] = !dayCells[index];
      return { ...task, progress: { ...task.progress, [day]: dayCells } };
    }));
    this.persist();
  }

  getTask(id: string): Task | undefined {
    return this.tasks().find(t => t.id === id);
  }

  dayStats(task: Task, day: number): DayStats {
    const cells = task.progress[day] ?? [];
    const done = cells.filter(Boolean).length;
    return { done, total: cells.length, complete: cells.length > 0 && done === cells.length };
  }

  taskStats(task: Task): TaskStats {
    let total = 0;
    let done = 0;
    let doneDays = 0;
    for (let day = 1; day <= task.days; day++) {
      const stats = this.dayStats(task, day);
      total += stats.total;
      done += stats.done;
      if (stats.complete) doneDays++;
    }
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0, doneDays };
  }
}
