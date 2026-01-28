import { DataService } from './../../services/data-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
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
import { delay, first, map, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToDoItemView } from '../to-do-item-view/to-do-item-view';

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
    ToDoItemView,
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private toastService: ToastService = inject(ToastService);
  private dataService: DataService = inject(DataService);
  private router = inject(Router);

  isLoading: boolean = true;
  allItems = this.dataService.getDisplayedToDoItems();

  readonly selectedItemId = toSignal(
    this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => console.log('selectedItemId from URL: ', id)),
    ),
  );
  readonly selectedItem = computed(() => {
    const itemId = this.selectedItemId();
    if (itemId) {
      return this.dataService.getItem(itemId);
    } else {
      return null;
    }
  });

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
            this.selectItem(createdItem.id);
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

  selectItem(itemId: string): void {
    console.log('selectItem: ', itemId);
    this.router.navigate(['tasks', itemId]);
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
