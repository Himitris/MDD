import { ArticleRequest } from './../interfaces/articleRequest.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../interfaces/article.interface';
import { MessageResponse } from '../interfaces/messageResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private pathService = 'api/article';

  constructor(private httpClient: HttpClient) {}

  public all(): Observable<Article[]> {
    return this.httpClient.get<Article[]>(this.pathService);
  }

  public detail(id: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.pathService}/${id}`);
  }

  public create(articleRequest: ArticleRequest): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(
      this.pathService,
      articleRequest
    );
  }
}
