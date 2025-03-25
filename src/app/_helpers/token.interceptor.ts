import { isPlatformServer } from '@angular/common';
import { HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { inject, Inject, PLATFORM_ID } from '@angular/core';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const plataformid = inject(PLATFORM_ID);
  if (isPlatformServer(plataformid)) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  let headers = req.headers.set('Content-Type', 'application/json');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  const authReq = req.clone({ headers });
  return next(authReq);
};
