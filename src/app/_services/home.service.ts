import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';


@Injectable()
export class HomeService{
    
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;

	}

	getCartera(token:any): Observable<any> {
		let headers = new HttpHeaders()
		  .set('Content-Type', 'application/json')
		  .set('Authorization', `Bearer ${token}`); 
	  
		return this._http.get(this.url + 'cartera', { headers: headers });
	  }

}
