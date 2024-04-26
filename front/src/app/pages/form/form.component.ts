import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleRequest } from 'src/app/interfaces/articleRequest.interface';
import { Message } from 'src/app/interfaces/message.interface';
import { ArticleService } from 'src/app/services/article.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  articleForm!: FormGroup;
  topics$ = this.topicService.all();
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private articleService: ArticleService,
    private topicService: TopicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public submit(): void {
    const article = this.articleForm?.value as ArticleRequest;

    this.subscription = this.articleService
      .create(article)
      .subscribe((_: Message) => this.exitPage('Article created !'));
  }

  private initForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.max(35)]],
      topic: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.max(10000)]],
    });
  }

  private exitPage(message: string): void {
    this.matSnackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['articles']);
  }
}
