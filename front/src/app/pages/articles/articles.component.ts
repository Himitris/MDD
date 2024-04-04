import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  public feed!: Article[] | null;
  public sortBy: 'dateAsc' | 'dateDesc' = 'dateAsc';
  public loading = true;
  private subscription?: Subscription;
  public innerWidth: number;
  public dateFormat: string = 'dd/MM/yy, à HH:mm';

  constructor(private articleService: ArticleService) {
    this.innerWidth = window.innerWidth;
    this.onResize();
  }

  ngOnInit(): void {
    this.subscription = this.articleService.feed().subscribe((feed) => {
      let combinedArticles: Article[] = [];
      Object.keys(feed).forEach((topic) => {
        combinedArticles = combinedArticles.concat(feed[topic]);
      });
      this.feed = combinedArticles;
      this.loading = false;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 425) {
      this.dateFormat = 'dd/MM/yy';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeSortBy(): void {
    this.sortBy = this.sortBy === 'dateAsc' ? 'dateDesc' : 'dateAsc';
  }

  truncateContent(content: string): string {
    const maxLength = this.innerWidth > 768 ? 200 : 85;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }
}
