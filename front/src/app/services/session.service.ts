import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionInformation } from '../interfaces/sessionInformation.interface';



@Injectable({ providedIn: 'root' })
export class SessionService {
  public sessionInformation: SessionInformation | undefined;
  private isLoggedSubject = new BehaviorSubject<boolean>(
    this.checkCookieExists()
  );

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public $isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public checkCookieExists(): boolean {
    const cookieExists = this.document.cookie.indexOf('JWT_TOKEN=') > -1;
    return cookieExists;
  }

  public logIn(user: SessionInformation): void {
    this.sessionInformation = user;
    this.isLoggedSubject.next(this.checkCookieExists());
  }

  public logOut(): void {
    this.document.cookie =
      'JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.isLoggedSubject.next(false);
  }
}
