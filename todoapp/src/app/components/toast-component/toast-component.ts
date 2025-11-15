import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Toast,
  ToastPosition,
  ToastService,
} from '../../services/toast-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  toasts: Signal<Toast[]> = toSignal(this.toastService.getToasts(), {
    initialValue: [],
  });
  position: ToastPosition = 'top-right';

  ngOnInit(): void {
    this.position = this.toastService.getPosition();
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  getPositionClass(): string {
    return `toast-container--${this.position}`;
  }

  getToastClass(toast: Toast): string {
    return `toast toast--${toast.type}`;
  }

  getProgressAnimationDuration(toast: Toast): string {
    return toast.duration ? `${toast.duration}ms` : '0ms';
  }
}
