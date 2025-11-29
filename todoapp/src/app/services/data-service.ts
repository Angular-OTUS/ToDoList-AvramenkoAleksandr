import { Injectable, Signal, signal } from '@angular/core';
import { ItemStatus, ToDoItem } from '../model/to-do-item';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly toDoItemList = signal<ToDoItem[]>([]);

  addNewTodoItem(item: ToDoItem): void {
    this.toDoItemList.update((currentItems) => [...currentItems, item]);
  }

  addAllTodoItems(itemList: ToDoItem[]): void {
    this.toDoItemList.update((currentItems) => [...currentItems, ...itemList]);
  }

  getAllToDoItems(): Signal<ToDoItem[]> {
    return this.toDoItemList.asReadonly();
  }

  removeToDoItem(itemId: string): void {
    this.toDoItemList.update((currentItems) =>
      currentItems.filter((value) => value.id !== itemId),
    );
  }

  startItemEditing(itemId: string, isEditing: boolean): void {
    this.toDoItemList.update((currentItems) =>
      currentItems.map((item) => {
        return {
          ...item,
          isEditing: item.id === itemId ? isEditing : item.isEditing,
        };
      }),
    );
  }

  checkItem(itemId: string, check: boolean): void {
    this.toDoItemList.update((currentItems) =>
      currentItems.map((item) => {
        return {
          ...item,
          status:
            item.id === itemId ? this.booleanToStatus(check) : item.status,
        };
      }),
    );
    console.log('toDoItemList: ', this.toDoItemList());
  }

  private booleanToStatus(check: boolean): ItemStatus {
    return check ? 'Completed' : 'InProgress';
  }

  updateItem(itemId: string, isEditing: boolean, newText: string): void {
    this.toDoItemList.update((currentItems) =>
      currentItems.map((item) => {
        return {
          ...item,
          isEditing: item.id === itemId ? isEditing : item.isEditing,
          text: item.id === itemId ? newText : item.text,
        };
      }),
    );
  }
}
