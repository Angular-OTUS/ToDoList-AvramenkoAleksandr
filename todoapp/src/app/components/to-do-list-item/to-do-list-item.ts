import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip-directive';

export interface EditInfo {
  itemId: string;
  isEditing: boolean;
  newText: string;
  action: 'save' | 'cancel';
}

@Component({
  selector: 'app-to-do-list-item',
  imports: [Button, TooltipDirective, FormsModule],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListItem {
  readonly id = input.required<string>();
  readonly text = input.required<string>();
  readonly isSelected = input<boolean>(false);
  readonly isEditing = input<boolean>(false);
  readonly isCompleted = input<boolean>(false);

  readonly itemDeleted = output<string>();
  readonly itemSelected = output<string>();
  readonly itemEdited = output<EditInfo>();
  readonly itemStartEditing = output<string>();
  readonly itemChecked = output<boolean>();

  readonly itemClass = computed(() =>
    this.isSelected() ? 'todo-item selected' : 'todo-item',
  );

  editText: string = '';

  onSelectItem(selectedItemId: string): void {
    this.itemSelected.emit(selectedItemId);
  }

  onDeleteItem(): void {
    this.itemDeleted.emit(this.id());
  }

  onDoubleClick(): void {
    console.log('onDoubleClick');
    if (!this.isEditing()) {
      this.itemStartEditing.emit(this.id());
      this.editText = this.text();
    }
  }

  onSave(): void {
    const trimmedText = this.editText.trim();
    if (trimmedText && trimmedText !== this.text()) {
      console.log('onSave: ', trimmedText);
      this.itemEdited.emit({
        itemId: this.id(),
        isEditing: false,
        newText: trimmedText,
        action: 'save',
      });
    } else {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.itemEdited.emit({
      itemId: this.id(),
      isEditing: false,
      newText: '',
      action: 'cancel',
    });
    this.editText = '';
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    console.log('Checkbox checked:', isChecked);
    this.itemChecked.emit(isChecked);
  }

  getClasses(): string[] {
    if (this.isSelected()) {
      return ['todo-item selected'];
    } else {
      return ['todo-item'];
    }
  }
}
