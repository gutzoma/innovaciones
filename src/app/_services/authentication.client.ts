import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../_models/login';
import { Global } from './global';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationClient {
  public url:string;
  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  login(login:Login): Observable<any> {
    return this.http.post(this.url + 'login', { login }, httpOptions);
  }

}