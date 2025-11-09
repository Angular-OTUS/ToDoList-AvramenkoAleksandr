import { Injectable } from '@angular/core';
import { ToDoItem } from '../model/to-do-item';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private toDoItemList: ToDoItem[] = [];

  addNewTodoItem(item: ToDoItem): void {
    this.toDoItemList.push(item);
  }

  addAllTodoItems(itemList: ToDoItem[]): void {
    this.toDoItemList = this.toDoItemList.concat(itemList);
  }

  getAllToDoItems(): ToDoItem[] {
    return this.toDoItemList;
  }

  removeToDoItem(itemId: string): void {
    this.toDoItemList = this.toDoItemList.filter((value) => value.id !== itemId);
  }
}
