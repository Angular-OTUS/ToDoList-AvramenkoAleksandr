import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-to-do-list-item',
  imports: [],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.css'
})
export class ToDoListItem {
  id = input.required<string>();
  text = input.required<string>();
  deleteItem = output<string>();

  onDeleteItem() {
    this.deleteItem.emit(this.id());
  }
}
