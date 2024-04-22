import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hide: boolean = true;
  public errorMessage = '';

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

  public submit(): void {
    if (this.isPasswordValid() && this.isEmailValid()) {
      const registerRequest = this.form.value as RegisterRequest;
      this.authService.register(registerRequest).subscribe({
        next: (response: SessionInformation) => {
          this.sessionService.logIn(response);
          this.router.navigate(['/articles']);
        },
        error: (error) => (this.errorMessage = error.error),
      });
    } else {
      this.errorMessage = !this.isPasswordValid
        ? 'Le mot de passe doit avoir 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.'
        : "L'adresse email n'est pas valide.";
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
