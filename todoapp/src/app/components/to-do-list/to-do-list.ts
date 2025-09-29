import { Component, ElementRef, Input, viewChild } from '@angular/core';

type ToDoItem = {
  id: string,
  text: string
}

@Component({
  selector: 'app-to-do-list',
  imports: [],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css'
})
export class ToDoList {
  addButtonSignal = viewChild.required<ElementRef<HTMLButtonElement>>('addItemButton');
  newItemDescriptionSignal = viewChild.required<ElementRef<HTMLInputElement>>('newItemDescriptionSignal');

  items: ToDoItem[] = [];

  onInputTextChange(event: Event) {
    const inputField = event.target as HTMLInputElement;

    if (inputField.id === "newItemDescription") {
      const addButtonElement = this.addButtonSignal().nativeElement;
      if (inputField.value?.length === 0) {
        console.log("Disable add button");
        addButtonElement.disabled = true;
        addButtonElement.classList.add('button--disabled');
      } else {
        console.log("Enable add button");
        addButtonElement.disabled = false;
        addButtonElement.classList.remove('button--disabled');
      }
    }

  }
}
