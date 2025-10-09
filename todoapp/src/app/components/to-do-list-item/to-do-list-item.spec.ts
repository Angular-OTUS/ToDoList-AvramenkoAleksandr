import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListItem } from './to-do-list-item';

describe('ToDoListItem', () => {
  let component: ToDoListItem;
  let fixture: ComponentFixture<ToDoListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
