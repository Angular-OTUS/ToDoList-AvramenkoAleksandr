import { DataService } from './../../services/data-service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { EditInfo, ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToDoItem } from '../../model/to-do-item';
import { Button } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip-directive';
import { ToastService } from '../../services/toast-service';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

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
    LoadingSpinner,
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit, AfterViewInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  private dataService: DataService = inject(DataService);

  readonly newItemTextSignal =
    viewChild.required<ElementRef<HTMLInputElement>>('newItemText');
  readonly newItemDescriptionSignal =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('newItemDescription');
  readonly currentItemDescriptionSignal = viewChild.required<
    ElementRef<HTMLTextAreaElement>
  >('currentItemDescription');

  selectedItemId: string | null | undefined = null;

  isLoading: boolean = true;

  allItems = this.dataService.getAllToDoItems();

  ngOnInit(): void {
    const items: ToDoItem[] = [
      {
        id: '1',
        text: 'Умыться',
        description: 'Надо, надо умываться по утрам и вечерам!',
        isEditing: false,
      },
      {
        id: '2',
        text: 'Сделать зарядку',
        description: 'Полезно для здоровья',
        isEditing: false,
      },
      {
        id: '3',
        text: 'Почитать почту',
        description: 'Там может быть что-то важное',
        isEditing: false,
      },
    ];
    this.dataService.addAllTodoItems(items);

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
      const currentIdList = this.dataService
        .getAllToDoItems()()
        .map((val) => Number(val.id));
      console.log('currentIdList: ', currentIdList);
      const newItemId =
        currentIdList.length === 0 ? 1 : Math.max(...currentIdList) + 1;
      const descriptionField = this.newItemDescriptionSignal().nativeElement;
      const itemText = inputField.value;
      this.dataService.addNewTodoItem({
        id: newItemId.toString(),
        text: itemText,
        description: descriptionField.value,
        isEditing: false,
      });

      inputField.value = '';
      descriptionField.value = '';
      this.onSelectItem(newItemId.toString());

      this.toastService.showToast('Todo item was added', 'success');
    }
  }

  onStartEditing(itemId: string): void {
    console.log('onStartEditing: ', itemId);
    this.dataService.startItemEditing(itemId, true);
  }

  onItemEdited(editInfo: EditInfo): void {
    if (editInfo.action === 'save') {
      this.dataService.updateItem(
        editInfo.itemId,
        editInfo.isEditing,
        editInfo.newText,
      );
    }
    this.dataService.startItemEditing(editInfo.itemId, false);
  }

  onSelectItem(selectedItemId: string): void {
    const itemDescriptionTextArea =
      this.currentItemDescriptionSignal().nativeElement;
    const currentItem = this.dataService
      .getAllToDoItems()()
      .find((item) => item.id === selectedItemId);
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
    this.dataService.removeToDoItem(itemId);

    this.toastService.showToast('Todo item was removed', 'info');
  }

  isAddButtonEnabled(): boolean {
    const inputField = this.newItemTextSignal().nativeElement;
    return inputField.value?.length > 0;
  }
}
