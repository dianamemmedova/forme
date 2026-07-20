import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { DOLLAR_STEP } from '../../theme/theme.constants';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  private readonly taskService = inject(TaskService);

  @Output() back = new EventEmitter<void>();

  private readonly taskId = signal<string | null>(null);
  readonly selectedDay = signal(1);

  @Input() set id(value: string) {
    this.taskId.set(value);
    this.selectedDay.set(1);
  }

  readonly task = computed(() => {
    const id = this.taskId();
    return id ? this.taskService.getTask(id) : undefined;
  });

  readonly dayList = computed(() => {
    const task = this.task();
    return task ? Array.from({ length: task.days }, (_, i) => i + 1) : [];
  });

  readonly cells = computed(() => {
    const task = this.task();
    const day = this.selectedDay();
    return task ? (task.progress[day] ?? []) : [];
  });

  readonly dayStats = computed(() => {
    const task = this.task();
    const day = this.selectedDay();
    return task ? this.taskService.dayStats(task, day) : { done: 0, total: 0, complete: false };
  });

  readonly overallStats = computed(() => {
    const task = this.task();
    return task ? this.taskService.taskStats(task) : { done: 0, total: 0, pct: 0, doneDays: 0 };
  });

  isDayComplete(day: number): boolean {
    const task = this.task();
    return task ? this.taskService.dayStats(task, day).complete : false;
  }

  cellLabel(index: number): string {
    const task = this.task();
    if (!task) return '';
    return task.type === 'trade' ? '$' + (index + 1) * DOLLAR_STEP : String(index + 1);
  }

  earnedAmount(): number {
    return this.dayStats().done * DOLLAR_STEP;
  }

  selectDay(day: number): void {
    this.selectedDay.set(day);
  }

  toggleCell(index: number): void {
    const task = this.task();
    if (!task) return;
    this.taskService.toggleCell(task.id, this.selectedDay(), index);
  }

  onBack(): void {
    this.back.emit();
  }
}
