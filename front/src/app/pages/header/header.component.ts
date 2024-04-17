import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public drawerService: DrawerService) {}

  ngOnInit(): void {}

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

  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
}
