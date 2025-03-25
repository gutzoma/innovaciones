import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Cliente } from '../_models/cliente';
import { ClienteCodeudor } from '../_models/codeudor';
import { ClienteNegocio } from '../_models/negocio';
import { Liquidaciones } from '../_models/liquidaciones';

@Injectable()
export class GeneralesService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	getTcliente(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'tipo-cliente', {headers: headers});
	}
	getTvivienda(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'tipo-vivienda', {headers: headers});
	}
	getTnegocio(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'tipo-negocio', {headers: headers});
	}
	getTedociv(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'tipo-edo-civ', {headers: headers});
	}
	getAsesores(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'asesores', {headers: headers});
	}
	getSucursales(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'sucursales', {headers: headers});
	}

	getTplazo(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.get(this.url+'plazos', {headers: headers});
	}

	runLiquidacion(liquidaciones: Liquidaciones): Observable<any>{

		let params = JSON.stringify(liquidaciones);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'liquidacion', params, {headers: headers});
	}

	runInsertPayment(pagos:any): Observable<any>{
		let params = JSON.stringify(pagos);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'insert_payment', params, {headers: headers});
	}
	
	runInsertCashbox(pagos:any): Observable<any>{
		let params = JSON.stringify(pagos);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'insert_cashbox', params, {headers: headers});
	}
	// getProjects(): Observable<any>{
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json');

	// 	return this._http.get(this.url+'projects', {headers: headers});
	// }

	// getProject(id): Observable<any>{
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json');

	// 	return this._http.get(this.url+'project/'+id, {headers: headers});
	// }

	// deleteProject(id): Observable<any>{
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json');

	// 	return this._http.delete(this.url+'project/'+id, {headers: headers});
	// }

	// updateProject(project): Observable<any>{
	// 	let params = JSON.stringify(project);
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json');

	// 	return this._http.put(this.url+'project/'+project._id, params, {headers: headers});
	// }

}