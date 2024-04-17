import { Component } from '@angular/core';
import { DrawerService } from './services/drawer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front';

  constructor(private router: Router, public drawerService: DrawerService) {}

  isOnArticlesPage(): boolean {
    return this.router.url === '/articles';
  }

  isOnThemesPage(): boolean {
    return this.router.url === '/themes';
  }

  isOnUserPage(): boolean {
    return this.router.url === '/user';
  }
}
