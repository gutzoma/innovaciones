import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class ProfileService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	getCarteraProfile(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'cartera-asesor/'+id, {headers: headers});
	}
	getCarteraAgenda(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'cartera-asesor-agenda/'+id, {headers: headers});
	}
	getCarteraClientes(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'cartera-asesor-clientes/'+id, {headers: headers});
	}

  getCreditHistory(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'credit-history/'+id, {headers: headers});
	}
  getCreditHistory2(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'credit-history2/'+id, {headers: headers});
	}
  getCreditHistory3(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'credit-history3/'+id, {headers: headers});
	}
  getCreditHistory4(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'credit-history4/'+id, {headers: headers});
	}

}
