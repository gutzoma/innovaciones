import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Report } from '../_models/report';

@Injectable()
export class ReportsService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

    getReport(report: Report): Observable<any>{
    
		let params = JSON.stringify(report);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'report', params, {headers: headers});
	}

	getReportPaying(report: Report): Observable<any>{
    
		let params = JSON.stringify(report);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'report_paying', params, {headers: headers});
	}
	getReportPayments(report: Report): Observable<any>{
    
		let params = JSON.stringify(report);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'report_payments', params, {headers: headers});
	}
	getReportCashBox(report: Report): Observable<any>{
    
		let params = JSON.stringify(report);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'report_cashbox', params, {headers: headers});
	}

}