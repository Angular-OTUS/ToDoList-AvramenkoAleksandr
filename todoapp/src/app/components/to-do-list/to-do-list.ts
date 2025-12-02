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
import { TooltipDirective } from '../../directives/tooltip-directive';
import { ToastService } from '../../services/toast-service';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { AddToDoItem } from '../add-to-do-item/add-to-do-item';

@Component({
  selector: 'app-to-do-list',
  imports: [
    AddToDoItem,
    ToDoListItem,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TooltipDirective,
    LoadingSpinner,
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  private dataService: DataService = inject(DataService);

  readonly currentItemDescriptionSignal = viewChild.required<
    ElementRef<HTMLTextAreaElement>
  >('currentItemDescription');

  selectedItemId: string | null | undefined = null;

  isLoading: boolean = true;

  allItems = this.dataService.getAllToDoItems();
  newItemId = this.dataService.getNewItemId();

  ngOnInit(): void {
    const items: ToDoItem[] = [
      {
        id: '1',
        text: 'Умыться',
        description: 'Надо, надо умываться по утрам и вечерам!',
        isEditing: false,
        status: 'InProgress',
      },
      {
        id: '2',
        text: 'Сделать зарядку',
        description: 'Полезно для здоровья',
        isEditing: false,
        status: 'InProgress',
      },
      {
        id: '3',
        text: 'Почитать почту',
        description: 'Там может быть что-то важное',
        isEditing: false,
        status: 'Completed',
      },
    ];
    this.dataService.addAllTodoItems(items);

    setTimeout(() => {
      this.isLoading = false;
      console.log('Loading items done, isLoading=', this.isLoading);
      this.cdr.markForCheck();
    }, 500);
  }

  onAddItem(newItem: ToDoItem): void {
    console.log('Adding an item: ', newItem);

    const currentIdList = this.dataService
      .getAllToDoItems()()
      .map((val) => Number(val.id));
    console.log('currentIdList: ', currentIdList);
    const newItemId =
      currentIdList.length === 0 ? 1 : Math.max(...currentIdList) + 1;
    this.dataService.addNewTodoItem(newItem);

    this.onSelectItem(newItemId.toString());

    this.toastService.showToast('Todo item was added', 'success');
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

  onCheckedItem(itemId: string, check: boolean): void {
    console.log('onCheckedItem item with id=', itemId, ' with value=', check);
    this.dataService.checkItem(itemId, check);
  }

  onDeleteItem(itemId: string): void {
    console.log('Deleting item with id=', itemId);
    this.dataService.removeToDoItem(itemId);

    this.toastService.showToast('Todo item was removed', 'info');
  }

  onItemStatusFilterChanged(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected value:', selectedValue);
    this.dataService.setItemStatusFilter(selectedValue);
  }
}
