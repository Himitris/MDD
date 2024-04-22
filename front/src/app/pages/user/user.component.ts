import { SessionInformation } from './../../interfaces/sessionInformation.interface';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, catchError, of } from 'rxjs';
import { ModifyUserRequest } from 'src/app/interfaces/modifyUserRequest.interface';
import { Topic } from 'src/app/interfaces/topic.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { TopicService } from 'src/app/services/topic.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public topics: Topic[] = [];
  public user!: SessionInformation;
  public userDataStorage!: SessionInformation;
  public newPassword: string = '';
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
        this.userDataStorage = cloneDeep(user);
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

  checkModification() {
    if (
      this.userDataStorage.username != this.user.username ||
      this.userDataStorage.email != this.user.email ||
      (this.newPassword !== null &&
        this.newPassword !== undefined &&
        this.newPassword !== '')
    ) {
      return true;
    }
    return false;
  }

  saveInfos(): void {
    if (
      this.user &&
      this.isPasswordValid() &&
      this.isEmailValid() &&
      this.checkModification()
    ) {
      this.errorMessage = '';
      const modifyUserRequest: ModifyUserRequest = {
        username: this.user.username,
        email: this.user.email,
        password: this.newPassword,
      };
      this.newPassword = '';
      this.subscription = this.authService
        .saveInfos(modifyUserRequest)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.error;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.matSnackBar.open(
              response.message + ', merci de vous reconnecter.',
              'Close',
              { duration: 3000 }
            );
            this.logOut();
          }
        });
    } else {
      if (!this.isPasswordValid()) {
        this.errorMessage =
          'Le mot de passe doit avoir 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.';
      } else if (!this.isEmailValid()) {
        this.errorMessage = "L'adresse email n'est pas valide.";
      } else {
        this.errorMessage = 'Aucun modification apportée';
      }
    }
  }

  private isPasswordValid(): boolean {
    const password = this.newPassword;
    return (
      !password ||
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
