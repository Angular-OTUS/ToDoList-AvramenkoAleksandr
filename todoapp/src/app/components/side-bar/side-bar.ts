import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {
  private router = inject(Router);

  get currentView(): string {
    const url = this.router.url;
    if (url.includes('/board')) return 'board';
    return 'backlog';
  }

  navigateTo(view: 'backlog' | 'board'): void {
    this.router.navigate([view === 'backlog' ? '/' : '/board']);
  }
}
