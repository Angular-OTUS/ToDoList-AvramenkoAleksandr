import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoItemView } from './to-do-item-view';

describe('ToDoItemView', () => {
  let component: ToDoItemView;
  let fixture: ComponentFixture<ToDoItemView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoItemView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoItemView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
