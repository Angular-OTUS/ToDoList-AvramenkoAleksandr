import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type ButtonType = 'add' | 'delete';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly type = input.required<ButtonType>();
  readonly isEnabled = input<boolean>(true);
  readonly clicked = output<Event>();

  onButtonClicked(event: Event): void {
    this.clicked.emit(event);
  }

  getClasses(): string[] {
    return [
      'button',
      this.type() === 'add' ? 'button--add' : 'button--delete',
      this.isEnabled() ? 'button--enabled' : 'button--disabled',
    ];
  }
}
