import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Article } from 'src/app/interfaces/article.interface';
import { Feed } from 'src/app/interfaces/feed.interface';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  public feed$: Observable<Feed> | null = null;
  public articles$: Observable<Article[]> | null = null;
  public sortBy: 'title' | 'date' = 'title';
  public loading = true;

  constructor(
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    forkJoin({
      feed: this.articleService.feed(),
      articles: this.articleService.all()
    }).subscribe({
      next: ({ feed, articles }) => {
        this.feed$ = of(feed);
        this.articles$ = of(articles);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data: ', err);
        this.loading = false; 
      }
    });
  }

  changeSortBy(sort: "title" | "date"): void {
    this.sortBy = sort;
  }

  truncateContent(content: string): string {
    const maxLength = 200;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }

}
