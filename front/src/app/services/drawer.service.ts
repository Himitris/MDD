import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  constructor() {}

  toggleDrawer() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  closeDrawer() {
    this.isOpenSubject.next(false);
  }
}
