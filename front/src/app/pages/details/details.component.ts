import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Article } from 'src/app/interfaces/article.interface';
import { Comment } from 'src/app/interfaces/comment.interface';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  article$: Observable<Article> | undefined;
  comments$: Observable<Comment[]> | undefined;
  loading: boolean = false;
  articleId: string = "";
  commentContent: string = "";
  private subscription?: Subscription;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.articleId = this.route.snapshot.params['id'];
    this.article$ = this.articleService.detail(this.articleId);
    this.comments$ = this.articleService.getComments(this.articleId);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendComment() : void{
    if (this.commentContent != "") {
      this.subscription = this.articleService.sendComment(this.articleId, this.commentContent).subscribe(response=>{
        this.commentContent = "";
        this.comments$ = this.articleService.getComments(this.articleId);
        this.matSnackBar.open(response.message, 'Close', { duration: 3000 });
      });
    } else {
      this.matSnackBar.open('Commentaire vide', 'Close', { duration: 3000 });
    }
  }
  
}
