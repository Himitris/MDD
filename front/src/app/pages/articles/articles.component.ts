import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Article } from 'src/app/interfaces/article.interface';
import { Feed } from 'src/app/interfaces/feed.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { ArticleService } from 'src/app/services/article.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  public feed$: Observable<Feed> = this.articleService.feed();
  public articles$: Observable<Article[]> = this.articleService.all();
  constructor(
    private sessionService: SessionService,
    private articleService: ArticleService
  ) {}

  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
