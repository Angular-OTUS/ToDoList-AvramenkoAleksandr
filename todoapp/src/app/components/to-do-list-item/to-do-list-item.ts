import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-to-do-list-item',
  imports: [],
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
