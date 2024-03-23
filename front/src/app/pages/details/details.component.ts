import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Article } from 'src/app/interfaces/article.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { ArticleService } from 'src/app/services/article.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  article$: Observable<Article> | undefined;
  loading: boolean = false;

  constructor(
    private sessionService: SessionService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.article$ = this.articleService.detail(this.route.snapshot.params['id']);
  }

  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
