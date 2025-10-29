import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToDoItem } from '../../model/to-do-item';
import { Button } from '../button/button';
import { TooltipDirective } from "../../directives/tooltip-directive";

@Component({
  selector: 'app-to-do-list',
  imports: [
    ToDoListItem,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Button,
    TooltipDirective,
],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit, AfterViewInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  readonly newItemTextSignal =
    viewChild.required<ElementRef<HTMLInputElement>>('newItemText');
  readonly newItemDescriptionSignal =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('newItemDescription');
  readonly currentItemDescriptionSignal =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('currentItemDescription');

  selectedItemId: string | null | undefined = null;

  items: ToDoItem[] = [
    { id: '1', text: 'Умыться', description: 'Надо, надо умываться по утрам и вечерам!' },
    { id: '2', text: 'Сделать зарядку', description: 'Полезно для здоровья' },
    { id: '3', text: 'Почитать почту', description: 'Там может быть что-то важное' },
  ];
  isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      console.log('Loading items done, isLoading=', this.isLoading);
      this.cdr.markForCheck();
    }, 500);
  }

  ngAfterViewInit(): void {
    console.log(
      'ngAfterViewInit, newItemTextSignal()=',
      this.newItemTextSignal(),
    );
  }

  onAddItem(): void {
    console.log('Adding an item');
    const inputField = this.newItemTextSignal().nativeElement;
    if (inputField.value?.length ?? 0 > 0) {
      const currentIdList = this.items.map((val) => Number(val.id));
      console.log('currentIdList: ', currentIdList);
      const newItemId =
        currentIdList.length === 0 ? 1 : Math.max(...currentIdList) + 1;
      const descriptionField = this.newItemDescriptionSignal().nativeElement;
      this.items.push({
        id: newItemId.toString(),
        text: inputField.value ,
        description: descriptionField.value
      });

      inputField.value = '';
      descriptionField.value = '';
      this.onSelectItem(newItemId.toString());
    }
  }

  onSelectItem(selectedItemId: string): void {
    const itemDescriptionTextArea = this.currentItemDescriptionSignal().nativeElement;
    const currentItem = this.items.find((item) => item.id === selectedItemId);
    if (currentItem) {
      if (this.selectedItemId !== selectedItemId) {
        // another item is being selected - set it as current
        this.selectedItemId = selectedItemId;
        itemDescriptionTextArea.value = currentItem.description;
      } else {
        // the same item was clicked - just unselect it
        this.selectedItemId = null;
        itemDescriptionTextArea.value = '';
      }

    } else {
      console.error('Item with id=', selectedItemId, ' not found');
    }

  }

  onDeleteItem(itemId: string): void {
    console.log('Deleting item with id=', itemId);
    this.items = this.items.filter((value) => value.id !== itemId);
  }

  isAddButtonEnabled(): boolean {
    const inputField = this.newItemTextSignal().nativeElement;
    return inputField.value?.length > 0;
  }
}
