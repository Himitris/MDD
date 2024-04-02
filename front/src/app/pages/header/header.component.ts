import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobileMenuOpen: boolean = false;

  constructor(private router: Router) {}

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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  onMenuOpened(opened: boolean): void {
    this.isMobileMenuOpen = opened;
  }
}
