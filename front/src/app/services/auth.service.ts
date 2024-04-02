import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { ModifyUserRequest } from '../interfaces/modifyUserRequest.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) {}

  public register(
    registerRequest: RegisterRequest
  ): Observable<SessionInformation> {
    return this.httpClient.post<SessionInformation>(
      `${this.pathService}/register`,
      registerRequest
    );
  }

  public login(loginRequest: LoginRequest): Observable<SessionInformation> {
    return this.httpClient.post<SessionInformation>(
      `${this.pathService}/login`,
      loginRequest
    );
  }

  public saveInfos(modifyUserRequest: ModifyUserRequest): Observable<Message> {
    return this.httpClient.put<Message>(
      `${this.pathService}/user`,
      modifyUserRequest
    );
  }
}
