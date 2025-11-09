import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Toast,
  ToastPosition,
  ToastService,
} from '../../services/toast-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  toasts: Toast[] = [];
  position: ToastPosition = 'top-right';
  private subscription!: Subscription;

  ngOnInit(): void {
    this.position = this.toastService.getPosition();

    this.subscription = this.toastService.getToasts().subscribe((toasts) => {
      console.log('Toasts received');
      this.toasts = toasts;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
