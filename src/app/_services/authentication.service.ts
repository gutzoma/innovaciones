import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationClient } from './authentication.client';
import { Login } from '../_models/login';
declare let $: any;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'userData';
  private token = 'token';

  constructor(
    private authenticationClient: AuthenticationClient,
    private router: Router
  ) {}

  public login(login:Login): void {
    this.authenticationClient.login(login).subscribe((data) => {
      if (data.status === 1) {
        localStorage.setItem(this.tokenKey, JSON.stringify(data.user));
        localStorage.setItem(this.token, JSON.stringify(data.token));
        this.router.navigate(['']);
      }else{
        $(".alert-text").removeClass("disp-n");
        setTimeout(() => {
          $(".alert-text").addClass("disp-n");
        }, 1500);
      }
    });
  }

  public logout() {
    localStorage.removeItem(this.token);
    window.location.href = '';
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.token);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.token) : null;
  }
}