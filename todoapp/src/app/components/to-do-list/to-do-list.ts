import { DataService } from './../../services/data-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { EditInfo, ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddToDoItemDto } from '../../model/to-do-item';
import { TooltipDirective } from '../../directives/tooltip-directive';
import { ToastService } from '../../services/toast-service';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { AddToDoItem } from '../add-to-do-item/add-to-do-item';
import { delay, first, tap } from 'rxjs';
import { ToDoItemView } from "../to-do-item-view/to-do-item-view";
import { ActivatedRoute } from '@angular/router';

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
    ToDoItemView
],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  private dataService: DataService = inject(DataService);
  private readonly route = inject(ActivatedRoute);

  selectedItemId = signal<string | null>(null);
  selectedItem = computed(() => {
    const id = this.selectedItemId();
    console.log('selectedItem id: ', id);
    if (id) {
      return this.dataService.getItem(id)
    } else {
      return null;
    }
  });

  isLoading: boolean = true;

  allItems = this.dataService.getDisplayedToDoItems();

  ngOnInit(): void {
    this.dataService
      .loadToDoItems()
      .pipe(
        delay(500),
        first(),
        tap(() => {
          this.isLoading = false;
          console.log('Loading items done, isLoading=', this.isLoading);
          this.cdr.markForCheck();
        }),
      )
      .subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    this.selectedItemId.set(id);
    console.log('ToDoList: tasks route with id=', id);
  }

  onAddItem(newItem: AddToDoItemDto): void {
    console.log('Adding an item: ', newItem);

    this.dataService
      .addNewTodoItem(newItem)
      .pipe(
        first(),
        tap(([createdItem, itemList]) => {
          console.log(
            'Created todo item ',
            createdItem,
            ' on server and loaded full list: ',
            itemList,
          );
          if (createdItem) {
            this.onSelectItem(createdItem.id);
            this.toastService.showToast('Todo item was added', 'success');
          } else {
            console.warn('No item was returned from server');
          }
        }),
      )
      .subscribe();
  }

  onStartEditing(itemId: string): void {
    console.log('onStartEditing: ', itemId);
    this.dataService.startItemEditing(itemId, true);
  }

  onItemEdited(editInfo: EditInfo): void {
    this.dataService.startItemEditing(editInfo.itemId, false);
    if (editInfo.action === 'save') {
      this.dataService
        .updateItem(editInfo.itemId, editInfo.newText)
        .pipe(
          first(),
          tap((result) => console.log('Update item result: ', result)),
        )
        .subscribe();
    }
  }

  onSelectItem(selectedItemId: string): void {
    console.log('onSelectItem selectedItemId: ', selectedItemId);

    if (this.selectedItemId() !== selectedItemId) {
      // another item is being selected - set it as current
      this.selectedItemId.set(selectedItemId);
    } else {
      // the same item was clicked - just unselect it
      this.selectedItemId.set(null);
    }
  }

  onCheckedItem(itemId: string, check: boolean): void {
    console.log('onCheckedItem item with id=', itemId, ' with value=', check);
    this.dataService
      .checkItem(itemId, check)
      .pipe(
        first(),
        tap((result) => console.log('Check item result: ', result)),
      )
      .subscribe();
  }

  onDeleteItem(itemId: string): void {
    console.log('Deleting item with id=', itemId);
    this.dataService
      .removeToDoItem(itemId)
      .pipe(
        first(),
        tap((result) => console.log('Check item result: ', result)),
        tap(() => {
          this.toastService.showToast('Todo item was removed', 'info');
        }),
      )
      .subscribe();
  }

  onItemStatusFilterChanged(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected value:', selectedValue);
    this.dataService.setItemStatusFilter(selectedValue);
  }
}
