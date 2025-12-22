import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-to-do-item-view',
  imports: [],
  templateUrl: './to-do-item-view.html',
  styleUrl: './to-do-item-view.css',
})
export class ToDoItemView {
  private dataService: DataService = inject(DataService);

  private readonly route = inject(ActivatedRoute);
  readonly selectedItemId = toSignal(
    this.route.paramMap.pipe(map((paramMap) => paramMap.get('id'))),
  );
  readonly selectedItem = computed(() => {
    const id = this.selectedItemId();
    console.log('selectedItem id: ', id);
    if (id) {
      return this.dataService.getItem(id);
    } else {
      return null;
    }
  });
  readonly itemText = computed<string>(() => {
    const item = this.selectedItem();
    if (item) {
      return item.text;
    } else {
      return '';
    }
  });
  readonly itemDescription = computed<string>(() => {
    const item = this.selectedItem();
    if (item) {
      return item.description;
    } else {
      return '';
    }
  });
}
