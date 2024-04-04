import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ArticleRequest } from 'src/app/interfaces/articleRequest.interface';
import { Message } from 'src/app/interfaces/message.interface';
import { ArticleService } from 'src/app/services/article.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public articleForm: FormGroup | undefined;
  public topics$ = this.topicService.all();

  constructor(
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private articleService: ArticleService,
    private topicService: TopicService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public submit(): void {
    const article = this.articleForm?.value as ArticleRequest;

    this.articleService
      .create(article)
      .subscribe((_: Message) => this.exitPage('Article created !'));
  }

  private initForm(article?: ArticleRequest): void {
    this.articleForm = this.fb.group({
      title: [
        article ? article.title : '',
        [Validators.required, Validators.max(35)],
      ],
      topic: [article ? article.topic : '', [Validators.required]],
      content: [
        article ? article.content : '',
        [Validators.required, Validators.max(10000)],
      ],
    });
  }

  private exitPage(message: string): void {
    this.matSnackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['articles']);
  }
}
