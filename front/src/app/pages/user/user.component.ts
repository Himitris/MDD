import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModifyUserRequest } from 'src/app/interfaces/modifyUserRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Topic } from 'src/app/interfaces/topic.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public topics: Topic[] = [];
  public user: SessionInformation | undefined;
  public newPassword: string = "";
  private subscription?: Subscription;
  public innerWidth: number;
  public hide = true;
  public errorMessage = '';

  constructor(
    private router: Router,
    private topicService: TopicService,
    private sessionService: SessionService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar
  ) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.subscription = this.authService
      .getMe()
      .subscribe((user: SessionInformation) => {
        this.user = user;
        this.subscription = this.topicService
          .subscription(this.user.id)
          .subscribe(
            (subscribedTopics: Topic[]) => {
              this.topics = subscribedTopics;
            },
            (error) => {
              console.error(
                "Une erreur s'est produite lors de la récupération des abonnements de l'utilisateur :",
                error
              );
            }
          );
      });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  logOut() {
    this.sessionService.logOut();
    this.router.navigate(['/articles']);
  }

  saveInfos(): void {
    if (this.user && this.isPasswordValid() && this.isEmailValid()) {
      this.errorMessage = '';
      const modifyUserRequest: ModifyUserRequest = {
        username: this.user.username,
        email: this.user.email,
        password: this.newPassword,
      };
      this.newPassword = "";
      this.subscription = this.authService
        .saveInfos(modifyUserRequest)
        .subscribe((response) => {
          this.matSnackBar.open(
            response.message + ', merci de vous reconnecter.',
            'Close',
            { duration: 3000 }
          );
          this.logOut();
        });
    } else {
      this.errorMessage = !this.isPasswordValid()
        ? 'Le mot de passe doit avoir 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.'
        : "L'adresse email n'est pas valide.";
    }
  }

  private isPasswordValid(): boolean {
    const password = this.newPassword;
    return (
      !!password &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
        password
      )
    );
  }

  private isEmailValid(): boolean {
    const email = this.user?.email;
    return (
      !!email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );
  }

  unsubscribe(topicId: number): void {
    this.subscription = this.topicService
      .unsubscribe(topicId)
      .subscribe((response) => {
        this.matSnackBar.open(response.message, 'Close', { duration: 3000 });
        this.topics = this.topics.filter((topic) => topic.id !== topicId);
      });
  }
}
