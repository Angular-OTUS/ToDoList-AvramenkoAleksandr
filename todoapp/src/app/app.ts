import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToDoList } from './components/to-do-list/to-do-list';
import { ToastComponent } from './components/toast-component/toast-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToDoList, ToastComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('todoapp');
}
