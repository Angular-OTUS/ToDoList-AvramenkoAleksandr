import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { AddToDoItemDto, ItemStatus, ToDoItem } from '../model/to-do-item';
import { ApiService } from './api-service';
import {
  combineLatest,
  concat,
  concatMap,
  first,
  map,
  Observable,
  of,
  switchMap,
  tap,
  zip,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly itemStatusFilter = signal<string | null>(null);
  private readonly toDoItemList = signal<ToDoItem[]>([]);
  private readonly displayToDoItemList = computed(() => {
    return this.applyFilter(this.toDoItemList(), this.itemStatusFilter());
  });

  private readonly apiService = inject(ApiService);

  setItemStatusFilter(statusFilter: string): void {
    this.itemStatusFilter.set(statusFilter);
  }

  addNewTodoItem(
    item: AddToDoItemDto,
  ): Observable<readonly [ToDoItem, ToDoItem[]]> {
    return this.apiService
      .createTodo(item)
      .pipe(
        switchMap((createdItem) =>
          this.loadToDoItems().pipe(
            map((itemList) => [createdItem, itemList] as const),
          ),
        ),
      );
  }

  getItem(itemId: string): ToDoItem | undefined {
    const displayedItems = this.displayToDoItemList();
    if (displayedItems && displayedItems.length > 0) {
      return displayedItems.find(item => item.id === itemId);
    } else {
      return undefined;
    }
  }

  getDisplayedToDoItems(): Signal<ToDoItem[]> {
    return this.displayToDoItemList;
  }

  removeToDoItem(itemId: string): Observable<ToDoItem[]> {
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

  loadToDoItems(): Observable<ToDoItem[]> {
    console.log('loadToDoItems called');
    return this.apiService.getAllTodos().pipe(
      tap((response) => console.log('Response data: ', response)),
      tap((response) => this.toDoItemList.set(response)),
    );
  }

  private applyFilter(
    itemList: ToDoItem[],
    itemStatusFilter: string | null,
  ): ToDoItem[] {
    console.log('Applying filter: ', itemStatusFilter);
    switch (itemStatusFilter) {
      case 'InProgress':
        return itemList.filter((item) => item.status === 'InProgress');
      case 'Completed':
        return itemList.filter((item) => item.status === 'Completed');
      case null:
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
