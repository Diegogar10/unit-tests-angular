import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/v1/auth`;
  private user = new BehaviorSubject<User | null>(null);

  myUser$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private tokenServices: TokenService,
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe(
      tap(response => this.tokenServices.saveToken(response.access_token))
    )
  }
// este envia el token manualmente cuando no tenemos interceptor que identigfique el token
// y lo envie automaticamente
/*   profile(token: string) {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        //'Contente-type': 'application/json'
      }
    })
    .pipe(
      tap(
        user=> this.user.next(user)
      )
    );
  } */

  profile() {
    return this.http.get<User>(`${this.apiUrl}/profile`,{})
    .pipe(
      tap(
        user=>{
          this.user.next(user)
        }
      )
    );
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(rta => this.profile())
    )
  }
  logout() {
    this.tokenServices.removeToken();
  }
}
