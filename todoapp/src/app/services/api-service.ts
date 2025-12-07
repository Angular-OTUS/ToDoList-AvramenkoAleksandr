import { inject, Injectable, signal } from '@angular/core';
import { ToDoItem } from '../model/to-do-item';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../model/api-response';
import { catchError, first, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type CreateTodoDto = Omit<ToDoItem, 'isEditing'>;
export type UpdateTodoDto = Partial<Omit<ToDoItem, 'id' | 'isEditing'>>;


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

  private todosSignal = signal<ToDoItem[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Public read-only signals
  readonly todos = this.todosSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getAllTodos(): Observable<ToDoItem[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let params = new HttpParams();

    return this.http.get<ToDoItem[]>(this.apiUrl, { params }).pipe(
      first(),
      tap(response => {
        console.log("getAllTodos() response: ", response);
        this.todosSignal.set(response);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Failed to load ALL todos');
        return throwError(() => error);
      })
    );
  }

  getTodoById(id: number): Observable<ApiResponse<ToDoItem>> {
    this.loadingSignal.set(true);

    return this.http.get<ApiResponse<ToDoItem>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(`Failed to load todo ${id}`);
        return throwError(() => error);
      })
    );
  }

  createTodo(todo: CreateTodoDto): Observable<ApiResponse<ToDoItem>> {
    this.loadingSignal.set(true);

    return this.http.post<ApiResponse<ToDoItem>>(this.apiUrl, todo).pipe(
      tap(response => {
        this.todosSignal.update(todos => [...todos, response.data]);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Failed to create a todo');
        return throwError(() => error);
      })
    );
  }

  // Update entire todo (PUT)
  updateTodo(id: string, todo: UpdateTodoDto): Observable<ApiResponse<ToDoItem>> {
    this.loadingSignal.set(true);

    return this.http.put<ApiResponse<ToDoItem>>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(response => {
        // Update todo in the signal
        this.todosSignal.update(todos =>
          todos.map(t => t.id === id ? response.data : t)
        );
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(`Failed to update todo ${id}`);
        return throwError(() => error);
      })
    );
  }

  // Partial update (PATCH)
  patchTodo(id: string, updates: Partial<ToDoItem>): Observable<ApiResponse<ToDoItem>> {
    this.loadingSignal.set(true);

    return this.http.patch<ApiResponse<ToDoItem>>(`${this.apiUrl}/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString()
    }).pipe(
      tap(response => {
        this.todosSignal.update(todos =>
          todos.map(t => t.id === id ? response.data : t)
        );
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(`Failed to partial update todo ${id}`);
        return throwError(() => error);
      })
    );
  }

  deleteTodo(id: string): Observable<ApiResponse<void>> {
    this.loadingSignal.set(true);

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.todosSignal.update(todos => todos.filter(t => t.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.errorSignal.set(`Failed to delete todo ${id}`);
        return throwError(() => error);
      })
    );
  }

  setTodoCompletionStatus(id: string, isCompleted: boolean): Observable<ApiResponse<ToDoItem>> {
    const todo = this.todosSignal().find(t => t.id === id);

    if (!todo) {
      return throwError(() => new Error(`Todo ${id} not found`));
    }

    return this.patchTodo(id, { status: ((isCompleted) ? 'Completed' : 'InProgress') });
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
