import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


  public topics: Topic[] = [];
  public user: SessionInformation | undefined;
  private subscription?: Subscription;

  constructor(
    private router: Router,
    private topicService: TopicService,
    private sessionService: SessionService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = this.sessionService.sessionInformation;
    if (this.user) {
      this.subscription = this.topicService.subscription(this.user.id).subscribe(
        (subscribedTopics: Topic[]) => {
          this.topics = subscribedTopics;
        },
        error => {
          console.error("Une erreur s'est produite lors de la récupération des abonnements de l'utilisateur :", error);
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logOut() {
    this.sessionService.logOut();
    this.router.navigate(['/articles']);
  }

  saveInfos(): void {
    if (this.user) {
      const modifyUserRequest: ModifyUserRequest = {
        username: this.user.username,
        email: this.user.email
      };
      this.subscription = this.authService.saveInfos(modifyUserRequest).subscribe((response) => {
        this.matSnackBar.open(response.message + ' Merci de vous reconnecter.', 'Close', { duration: 3000 });
        this.logOut();
      });
    }
  }

  unsubscribe(topicId: number): void {
    this.subscription = this.topicService.unsubscribe(topicId).subscribe((response) => {
      this.matSnackBar.open(response.message, 'Close', { duration: 3000 });
      this.topics = this.topics.filter(topic => topic.id !== topicId);
    });
  }

}
