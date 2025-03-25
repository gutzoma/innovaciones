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
      const user = JSON.parse(localStorage.getItem('userData')!);
      const token = JSON.parse(localStorage.getItem('token')!);
      let name = user.nombres + ' ' + user.paterno + ' ' + user.materno;
      $('.menu-sections').removeClass('disp-n');
      $('.user-name').removeClass('disp-n');
      $('.name').html(name);
      if (user.rol == 3 && user.id != 3) {
        $('.nivel4').addClass('disp-n');
      }
      if (user.rol == 5) {
        $('.nivel5').addClass('disp-n');
      }
      if (user.rol == 6) {
        $('.nivel4').addClass('disp-n');
        $('.nivel1').addClass('disp-n');
      }
      if (user.rol == 7) {
        $('.nivel4').addClass('disp-n');
      }
      if (user.rol == 8) {
        $('.nivel8').addClass('disp-n');
      }

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

      // if (token) {
      //   scheduleTokenExpiration(token);
      // }
    }

    return true;
  }
}
