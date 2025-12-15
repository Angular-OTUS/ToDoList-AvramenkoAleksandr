export type ItemStatus = 'InProgress' | 'Completed';

export interface ToDoItem {
  id: string;
  text: string;
  description: string;
  isEditing: boolean;
  status: ItemStatus;
}

export type AddToDoItemDto = Omit<ToDoItem, 'id' | 'isEditing'>;
