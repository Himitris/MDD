import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Topic } from '../interfaces/topic.interface';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private pathService = 'api/topics';

  constructor(private httpClient: HttpClient) {}

  public all(): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(this.pathService);
  }

  public detail(id: string): Observable<Topic> {
    return this.httpClient.get<Topic>(`${this.pathService}/${id}`);
  }

  public subscribe(topicId: number): Observable<Message> {
    return this.httpClient.post<Message>(`${this.pathService}/participate`, {"topic" : topicId });
  }

  public unsubscribe(topicId: number): Observable<Message> {   
    return this.httpClient.delete<Message>(`${this.pathService}/${topicId}/participate`);
  }

  public subscription(userId: number): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${this.pathService}/${userId}/subscription`);
  }
  
}
