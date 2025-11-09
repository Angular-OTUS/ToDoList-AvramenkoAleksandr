import { inject, Injectable, TemplateRef } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message?: string;
  template?: TemplateRef<any>;
  duration?: number;
  dismissible?: boolean;
}

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastMessage {
  messageText: string,
  caption: string,
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private position: ToastPosition = 'bottom-right';
  private nextId = 0;

  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  setPosition(position: ToastPosition): void {
    this.position = position;
  }

  getPosition(): ToastPosition {
    return this.position;
  }

  showToast(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const toast: Toast = {
      id: this.nextId++,
      type,
      message,
      duration,
      dismissible: true,
    };

    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    // Auto remove if duration is set
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.showToast(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.showToast(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.showToast(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.showToast(message, 'info', duration);
  }

  showTemplate(template: TemplateRef<any>, type: Toast['type'] = 'info', duration = 5000): void {
    const toast: Toast = {
      id: this.nextId++,
      type,
      template,
      duration,
      dismissible: true,
    };

    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  clear(): void {
    this.toasts = [];
    this.toastsSubject.next([]);
  }

  // private snackBar = inject(MatSnackBar);

  // showToast(message: ToastMessage): void {
  //   this.snackBar.open(message.messageText, message.caption, {
  //     verticalPosition: 'bottom',
  //     horizontalPosition: 'right',
  //     duration: 3000,
  //   });
  // }

  // showToastList(messages: ToastMessage[]): void {
  //   messages.forEach((msg) => this.showToast(msg));
  // }

  // showToastSimple(text: string, caption: string): void {
  //   this.showToast({
  //     messageText: text,
  //     caption: caption,
  //   });
  // }
}
