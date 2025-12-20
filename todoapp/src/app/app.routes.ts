import { Routes } from '@angular/router';
import { ToDoList } from './components/to-do-list/to-do-list';

export const routes: Routes = [
  {
    path: 'tasks',
    component: ToDoList,
    title: 'TO DO List',
    pathMatch: 'full'
  },
  {
    path: 'tasks/:id',
    component: ToDoList,
    title: 'TO DO List',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
