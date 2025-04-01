import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

declare let $: any;
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      function scheduleTokenExpiration(token: string): void {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000 - Date.now(); // Tiempo restante en milisegundos

        if (expirationTime > 0) {
          setTimeout(() => {
            console.log('El token ha expirado automáticamente');
            localStorage.clear(); // Limpiar el token
          }, expirationTime);
        }
      }
      const token = localStorage.getItem('token');
      if (token) {
        scheduleTokenExpiration(token);
      }
    }

    return true;
  }
}
