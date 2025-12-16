import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToDoItem } from './add-to-do-item';

describe('AddToDoItem', () => {
  let component: AddToDoItem;
  let fixture: ComponentFixture<AddToDoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToDoItem],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToDoItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
