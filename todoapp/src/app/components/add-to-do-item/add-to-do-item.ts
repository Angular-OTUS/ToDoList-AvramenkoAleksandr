import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToDoItem } from '../../model/to-do-item';
import { Button } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip-directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

function* idSequence() {
  let num = 0;
  while (true) {
    yield num;
    num += 1;
  }
}

@Component({
  selector: 'app-add-to-do-item',
  imports: [
    ReactiveFormsModule,
    Button,
    TooltipDirective,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-to-do-item.html',
  styleUrl: './add-to-do-item.css',
})
export class AddToDoItem {
  private fb = inject(FormBuilder);
  readonly itemAdded = output<ToDoItem>();
  private idSeq = idSequence();

  addTodoForm: FormGroup;

  constructor() {
    this.addTodoForm = this.createForm();
  }

  private newItemId(): string {
    const newIdValue = this.idSeq.next().value as number;
    console.log('newIdValue: ', newIdValue);
    return newIdValue.toString();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      newItemText: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      newItemDescription: ['', [Validators.maxLength(500)]],
    });
  }

  isAddButtonEnabled(): boolean {
    return this.addTodoForm.valid;
  }

  onAddItem(): void {
    if (this.addTodoForm.valid) {
      const formValue = this.addTodoForm.value;
      console.log('Adding an item from form value: ', formValue);
      const itemText = formValue['newItemText'];
      const itemDescription = formValue['newItemDescription'];
      const newItem: ToDoItem = {
        id: this.newItemId(),
        text: itemText,
        description: itemDescription,
        isEditing: false,
        status: 'InProgress',
      };
      this.resetForm();
      this.itemAdded.emit(newItem);
    }
  }

  resetForm(): void {
    this.addTodoForm.reset();
    this.addTodoForm.markAsPristine();
    this.addTodoForm.markAsUntouched();
  }
}
