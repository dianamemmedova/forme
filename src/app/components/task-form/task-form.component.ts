import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskType } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  private readonly taskService = inject(TaskService);

  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();

  readonly type = signal<TaskType>('course');
  name = '';
  days = 5;
  perDay = 30;
  dailyTarget = 50;

  get namePlaceholder(): string {
    return this.type() === 'course' ? 'Məs: Udemy — React kursu' : 'Məs: Gündəlik treyd hədəfi';
  }

  selectType(type: TaskType): void {
    this.type.set(type);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onSubmit(): void {
    const days = Math.max(1, Number(this.days) || 5);
    const type = this.type();

    const task = type === 'course'
      ? this.taskService.createTask({
          name: this.name,
          type,
          days,
          perDay: Math.max(1, Number(this.perDay) || 30)
        })
      : this.taskService.createTask({
          name: this.name,
          type,
          days,
          dailyTarget: Math.max(5, Number(this.dailyTarget) || 50)
        });

    this.created.emit(task.id);
  }
}
