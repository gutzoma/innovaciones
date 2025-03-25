import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Cliente } from '../_models/cliente';
import { ClienteCodeudor } from '../_models/codeudor';
import { ClienteNegocio } from '../_models/negocio';

@Injectable()
export class ClienteService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	saveCliente(cliente: Cliente, clientecodeudor: ClienteCodeudor, clientecegocio: ClienteNegocio, asesor:any, imgs:any): Observable<any>{
    
		let params = JSON.stringify({cliente, clientecodeudor, clientecegocio, asesor, imgs});
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'save-cliente', params, {headers: headers});
	}
	upCliente(cliente: Cliente, clientecodeudor: ClienteCodeudor, clientecegocio: ClienteNegocio, cliente_id: string): Observable<any>{

		let params = JSON.stringify({cliente, clientecodeudor, clientecegocio, cliente_id});
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'up-cliente', params, {headers: headers});
	}
}