import { Routes } from '@angular/router';
import { ToDoList } from './components/to-do-list/to-do-list';
import { ToDoItemView } from './components/to-do-item-view/to-do-item-view';

export const routes: Routes = [
  {
    path: 'tasks',
    component: ToDoList,
  },
  {
    path: 'tasks/:id',
    component: ToDoList,
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/tasks',
  },
];
