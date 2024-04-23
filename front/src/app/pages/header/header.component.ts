import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router, public drawerService: DrawerService) {}

  isAuthenticated(): boolean {
    const currentUrl = this.router.url;
    return currentUrl !== '/login' && currentUrl !== '/register';
  }

  isOnArticlesPage(): boolean {
    return this.router.url === '/articles';
  }

  isOnThemesPage(): boolean {
    return this.router.url === '/themes';
  }

  isOnUserPage(): boolean {
    return this.router.url === '/user';
  }

  toggleDrawer(): void{
    this.drawerService.toggleDrawer();
  }
}
