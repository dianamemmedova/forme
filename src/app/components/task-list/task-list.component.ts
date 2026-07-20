import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TASK_TYPE_LABELS } from '../../theme/theme.constants';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);

  @Output() openTask = new EventEmitter<string>();
  @Output() createTask = new EventEmitter<void>();

  readonly tasks = this.taskService.tasks;
  readonly typeLabels = TASK_TYPE_LABELS;

  stats(task: Task) {
    return this.taskService.taskStats(task);
  }

  meta(task: Task): string {
    return task.type === 'course'
      ? `${task.days} gün · gündə ${task.cellsPerDay} video`
      : `${task.days} gün · gündə $${task.dailyTarget}`;
  }

  onOpen(id: string): void {
    this.openTask.emit(id);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Bu tapşırığı silmək istədiyinizə əminsiniz?')) {
      this.taskService.deleteTask(id);
    }
  }

  onCreate(): void {
    this.createTask.emit();
  }
}
