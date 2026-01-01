import { Component, computed, inject, input } from '@angular/core';
import { ToDoItem, ToDoItemData } from '../../model/to-do-item';

@Component({
  selector: 'app-to-do-item-view',
  imports: [],
  templateUrl: './to-do-item-view.html',
  styleUrl: './to-do-item-view.css',
})
export class ToDoItemView {
  readonly item = input.required<ToDoItem | null | undefined>();
  readonly itemText = computed<string>(() => {
    return this.item()?.text ?? '';
  });
  readonly itemDescription = computed<string>(() => {
    return this.item()?.description ?? '';
  });
}
