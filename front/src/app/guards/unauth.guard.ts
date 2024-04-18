import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnauthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {}

  public canActivate(): Observable<boolean> {
    return this.sessionService.$isLogged().pipe(
      map((isLogged) => {
        if (isLogged) {
          this.router.navigate(['articles']); // Redirige vers la page des articles si déjà connecté
          return false;
        }
        return true;
      })
    );
  }
}
