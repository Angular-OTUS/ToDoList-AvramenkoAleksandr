import { AfterViewInit, Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';

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
export class ToDoList implements AfterViewInit {
  addButtonSignal = viewChild.required<ElementRef<HTMLButtonElement>>('addItemButton');
  newItemDescriptionSignal = viewChild.required<ElementRef<HTMLInputElement>>('newItemText');

  items: ToDoItem[] = [];

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit, newItemDescriptionSignal()=", this.newItemDescriptionSignal());

    this.enableAddButton(false);
  }

  onInputTextChange(event: Event) {
    const inputField = event.target as HTMLInputElement;

    if (inputField.id === "newItemDescription") {
      this.enableAddButton(inputField.value?.length > 0);
    }
  }

  onAddItem() {
    console.log("Adding an item");
    const inputField = this.newItemDescriptionSignal().nativeElement;
    if (inputField.value?.length ?? 0 > 0) {
      const currentIdList = this.items.map((val, idx) => Number(val.id));
      console.log("currentIdList: ", currentIdList);
      const newItemId = currentIdList.length == 0 ? 1 : Math.max(...currentIdList) + 1;
      this.items.push({ id: newItemId.toString(), text: inputField.value });

      inputField.value = '';
    }
  }

  onDeleteItem(itemId: string) {
    console.log("Deleting item with id=", itemId);
    this.items = this.items.filter((value, index) => value.id !== itemId);
  }

  private enableAddButton(enable: boolean) {
    const addButtonElement = this.addButtonSignal().nativeElement;
    if (enable) {
      console.log("Enable add button");
      addButtonElement.disabled = false;
      addButtonElement.classList.remove('button--disabled');
    } else {
      console.log("Disable add button");
      addButtonElement.disabled = true;
      addButtonElement.classList.add('button--disabled');
    }
  }
}
