import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterRequest } from 'src/app/interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  hide: boolean = true;
  errorMessage = '';
  private subscription?: Subscription;

  public form = this.fb.group({
    username: ['', [Validators.required, Validators.min(6)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(3)]],
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private sessionService: SessionService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public submit(): void {
    if (
      this.isPasswordValid() &&
      this.isEmailValid() &&
      (this.form.get('username')?.value as string) != ''
    ) {
      const registerRequest = this.form.value as RegisterRequest;
      this.subscription = this.authService.register(registerRequest).subscribe({
        next: (response: SessionInformation) => {
          this.sessionService.logIn(response);
          this.router.navigate(['/articles']);
        },
        error: (error) => (this.errorMessage = error.error),
      });
    } else if (!this.isPasswordValid()) {
      this.errorMessage =
        'Le mot de passe doit avoir 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.';
    } else if (!this.isEmailValid()) {
      this.errorMessage = "L'adresse email n'est pas valide.";
    } else {
      this.errorMessage = 'Veuillez rentrer un pseudo';
    }
  }

  private isPasswordValid(): boolean {
    const passwordControl = this.form.get('password');
    const password = passwordControl?.value as string; // Type assertion
    if (password) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      return regex.test(password);
    }
    return false;
  }

  private isEmailValid(): boolean {
    const emailControl = this.form.get('email');
    const email = emailControl?.value as string;
     return (
       !!email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     );
  }
}
