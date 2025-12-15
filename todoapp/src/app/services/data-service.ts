import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { AddToDoItemDto, ItemStatus, ToDoItem } from '../model/to-do-item';
import { ApiService } from './api-service';
import { concat, concatMap, first, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly itemStatusFilter = signal<string>('ALL');
  private readonly toDoItemList = signal<ToDoItem[]>([]);
  private readonly displayToDoItemList = computed(() => {
    return this.applyFilter(this.toDoItemList(), this.itemStatusFilter());
  });

  private readonly apiService = inject(ApiService);

  setItemStatusFilter(statusFilter: string): void {
    this.itemStatusFilter.set(statusFilter);
  }

  addNewTodoItem(item: AddToDoItemDto): Observable<ToDoItem> {
    return this.apiService
      .createTodo(item)
      .pipe(concatMap(() => this.loadToDoItems()));
  }

  getDisplayedToDoItems(): Signal<ToDoItem[]> {
    return this.displayToDoItemList;
  }

  removeToDoItem(itemId: string): Observable<any> {
    return this.apiService
      .deleteTodo(itemId)
      .pipe(concatMap(() => this.loadToDoItems()));
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

  checkItem(itemId: string, check: boolean): Observable<any> {
    return this.apiService
      .setTodoCompletionStatus(itemId, check)
      .pipe(concatMap(() => this.loadToDoItems()));
  }

  loadToDoItems(): Observable<any> {
    console.log('loadToDoItems called');
    return this.apiService.getAllTodos().pipe(
      tap((response) => console.log('Response data: ', response)),
      tap((response) => this.toDoItemList.set(response)),
    );
  }

  private booleanToStatus(check: boolean): ItemStatus {
    return check ? 'Completed' : 'InProgress';
  }

  private applyFilter(
    itemList: ToDoItem[],
    itemStatusFilter: string,
  ): ToDoItem[] {
    console.log('Applying filter: ', itemStatusFilter);
    switch (itemStatusFilter) {
      case 'InProgress':
        return itemList.filter((item) => item.status === 'InProgress');
      case 'Completed':
        return itemList.filter((item) => item.status === 'Completed');
      case 'ALL':
      default:
        return itemList;
    }
  }

  updateItem(itemId: string, newText: string): Observable<any> {
    return this.apiService
      .patchTodo(itemId, { text: newText })
      .pipe(concatMap(() => this.loadToDoItems()));
  }
}
