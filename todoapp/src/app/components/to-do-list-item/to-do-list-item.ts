import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-to-do-list-item',
  imports: [Button],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListItem {
  readonly id = input.required<string>();
  readonly text = input.required<string>();
  readonly deleteItem = output<string>();

  onDeleteItem(): void {
    this.deleteItem.emit(this.id());
  }
}
