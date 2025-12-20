import { Component, input } from '@angular/core';

@Component({
  selector: 'app-to-do-item-view',
  imports: [],
  templateUrl: './to-do-item-view.html',
  styleUrl: './to-do-item-view.css'
})
export class ToDoItemView {
  readonly itemText = input.required();
  readonly itemDescription = input('');
}
