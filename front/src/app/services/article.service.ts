import { ArticleRequest } from './../interfaces/articleRequest.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../interfaces/article.interface';
import { Feed } from '../interfaces/feed.interface';
import { Comment } from '../interfaces/comment.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private pathService = 'api/article';
  private pathApi = 'api';

  constructor(private httpClient: HttpClient) { }

  public all(): Observable<Article[]> {
    return this.httpClient.get<Article[]>(this.pathService);
  }

  public feed(): Observable<Feed> {
    return this.httpClient.get<Feed>(`${this.pathService}/feed`);
  }

  public detail(id: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.pathService}/${id}`);
  }

  public create(articleRequest: ArticleRequest): Observable<Message> {
    return this.httpClient.post<Message>(
      this.pathService,
      articleRequest
    );
  }

  public getComments(articleId: string): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.pathApi}/${articleId}/comment`);
  }

  public sendComment(articleId: string, content: string): Observable<Message> {
    return this.httpClient.post<Message>(`${this.pathApi}/${articleId}/comment`, {"content": content});
  }
}
