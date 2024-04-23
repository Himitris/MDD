import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Topic } from 'src/app/interfaces/topic.interface';
import { SessionService } from 'src/app/services/session.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  public topics$: Observable<Topic[]> = this.topicService.all();
  public user: SessionInformation | undefined;
  public subscribedTopics: number[] = [];
  private subscription?: Subscription;

  constructor(
    private topicService: TopicService,
    private sessionService: SessionService,
    private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = this.sessionService.sessionInformation;
    if (this.user) {
      this.subscription = this.topicService.subscription(this.user.id).subscribe(
        (subscribedTopics: Topic[]) => {
          for (const topic of subscribedTopics) {
            this.subscribedTopics.push(topic.id);
          }
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

  isSubscribed(topicId: number): boolean {
    return this.subscribedTopics.includes(topicId);
  }

  toggleSubscription(topicId: number): void {
    if (this.isSubscribed(topicId)) {
      this.unsubscribe(topicId);
    } else {
      this.subscribe(topicId);
    }
  }

  subscribe(topicId: number): void {
    this.subscription = this.topicService.subscribe(topicId).subscribe((response) => {
      this.matSnackBar.open(response.message, 'Close', { duration: 3000 });
      this.subscribedTopics.push(topicId);
    });
  }

  unsubscribe(topicId: number): void {
    this.subscription = this.topicService.unsubscribe(topicId).subscribe((response) => {
      this.matSnackBar.open(response.message, 'Close', { duration: 3000 });
      this.subscribedTopics = this.subscribedTopics.filter(id => id !== topicId);
    });
  }

}
