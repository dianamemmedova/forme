import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

type Screen = 'list' | 'form' | 'detail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent, TaskDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly screen = signal<Screen>('list');
  readonly activeTaskId = signal<string | null>(null);

  goToForm(): void {
    this.screen.set('form');
  }

  goToList(): void {
    this.screen.set('list');
    this.activeTaskId.set(null);
  }

  openTask(id: string): void {
    this.activeTaskId.set(id);
    this.screen.set('detail');
  }

  onTaskCreated(id: string): void {
    this.openTask(id);
  }
}
