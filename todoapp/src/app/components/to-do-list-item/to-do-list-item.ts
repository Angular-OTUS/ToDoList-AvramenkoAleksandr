import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { Button } from '../button/button';
import { TooltipDirective } from "../../directives/tooltip-directive";

@Component({
  selector: 'app-to-do-list-item',
  imports: [Button, TooltipDirective],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListItem {
  readonly id = input.required<string>();
  readonly text = input.required<string>();
  readonly itemDeleted = output<string>();
  readonly itemSelected = output<string>();
  readonly isSelected = model<boolean>(false);

  onSelectItem(selectedItemId: string): void {
    this.isSelected.set(true);
    this.itemSelected.emit(selectedItemId);
  }

  onDeleteItem(): void {
    this.itemDeleted.emit(this.id());
  }

  getClasses(): string[] {
    if (this.isSelected()) {
      return ['todo-item selected'];
    } else {
      return ['todo-item'];
    }
  }
}
