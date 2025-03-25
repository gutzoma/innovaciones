import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { ClienteCredito } from '../_models/credito';
import { ClienteGarantia } from '../_models/garantia';
import { DataCredito } from '../_models/datacredito';

@Injectable()
export class CreditosService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	getClientes(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.get(this.url+'show-clientes', {headers: headers});
	}

	getCliente(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'cliente/'+id, {headers: headers});
	}

	saveCredit(clientecredito: ClienteCredito, asesor:any): Observable<any>{
		let params = JSON.stringify({clientecredito, asesor});
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'save-credito', params, {headers: headers});
	}

	getClientesCred(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.get(this.url+'show-clientes-cred', {headers: headers});
	}

	getClientesApro(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.get(this.url+'show-clientes-apro', {headers: headers});
	}

	getCreditos(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.get(this.url+'show-creditos', {headers: headers});
	}

	getCredito(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'credito/'+id, {headers: headers});
	}

	getCreditoDes(id: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'creditodes/'+id, {headers: headers});
	}
	upCredit(clientecredito: ClienteCredito, clientegarantia: ClienteGarantia, asesor:any): Observable<any>{

		let params = JSON.stringify({clientecredito, clientegarantia, asesor});
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'up-credito', params, {headers: headers});
	}

	editCredito(clientecredito: ClienteCredito): Observable<any>{

		let params = JSON.stringify({clientecredito});
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'edit-credito', params, {headers: headers});
	}

	createPrest(datacredito: DataCredito, cuotas:any, asesor:any): Observable<any>{

		let params = JSON.stringify({datacredito, cuotas, asesor});
		console.log(params);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'create-prest', params, {headers: headers});
	}

}