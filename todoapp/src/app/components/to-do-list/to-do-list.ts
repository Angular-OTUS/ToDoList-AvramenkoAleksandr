import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  viewChild,
} from '@angular/core';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToDoItem } from '../../model/to-do-item';

@Component({
  selector: 'app-to-do-list',
  imports: [
    ToDoListItem,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit, AfterViewInit {
  readonly addButtonSignal =
    viewChild.required<ElementRef<HTMLButtonElement>>('addItemButton');
  readonly newItemDescriptionSignal =
    viewChild.required<ElementRef<HTMLInputElement>>('newItemText');

  items: ToDoItem[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => (this.isLoading = true), 500);
  }

  ngAfterViewInit(): void {
    console.log(
      'ngAfterViewInit, newItemDescriptionSignal()=',
      this.newItemDescriptionSignal(),
    );

    this.enableAddButton(false);
  }

  onInputTextChange(event: Event): void {
    const inputField = event.target as HTMLInputElement;

    if (inputField.id === 'newItemDescription') {
      this.enableAddButton(inputField.value?.length > 0);
    }
  }

  onAddItem(): void {
    console.log('Adding an item');
    const inputField = this.newItemDescriptionSignal().nativeElement;
    if (inputField.value?.length ?? 0 > 0) {
      const currentIdList = this.items.map((val) => Number(val.id));
      console.log('currentIdList: ', currentIdList);
      const newItemId =
        currentIdList.length === 0 ? 1 : Math.max(...currentIdList) + 1;
      this.items.push({ id: newItemId.toString(), text: inputField.value });

      inputField.value = '';
      this.enableAddButton(false);
    }
  }

  onDeleteItem(itemId: string): void {
    console.log('Deleting item with id=', itemId);
    this.items = this.items.filter((value) => value.id !== itemId);
  }

  private enableAddButton(enable: boolean): void {
    const addButtonElement = this.addButtonSignal().nativeElement;
    if (enable) {
      console.log('Enable add button');
      addButtonElement.disabled = false;
      addButtonElement.classList.remove('button--disabled');
    } else {
      console.log('Disable add button');
      addButtonElement.disabled = true;
      addButtonElement.classList.add('button--disabled');
    }
  }
}
