import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Report } from '../../_models/report';

import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { ReportsService } from '../../_services/reports.service';

declare let $: any;

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

class PickDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-report-payments',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SelectDropDownModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-payments.component.html',
  styles: ``,
  providers: [
    GeneralesService,
    ReportsService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
})
export class ReportPaymentsComponent {

  public asesores!: any;
  public report: Report;
  public reportInfo!: any;

  constructor(private _generalesservice: GeneralesService, private _reportsservice: ReportsService) {
    
    this.report = new Report('', '', '', '');
   }

   date : any;

   ngOnInit(): void {
     this.getAsesores();
   }

   getAsesores() {
    this._generalesservice.getAsesores().subscribe(
      response => {
        if (response) {
          this.asesores = response;
        }
      },
      error => {
        console.log(<any>error);
        if (error.status === 401) {
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }

  getReportPayments(form: { reset: () => void; }){
    if($("input[name=f_inicial]").val() == '' || $("input[name=f_final]").val() == '') {
     alert('ingresa fechas validas')
    }else{
      var f_inicial:any = $("input[name=f_inicial]").val();
      f_inicial = f_inicial.split("-");
      this.report.f_inicial = f_inicial[2]+'-'+f_inicial[1]+'-'+f_inicial[0];
      var f_final:any = $("input[name=f_final]").val();
      f_final = f_final.split("-");
      this.report.f_final = f_final[2]+'-'+f_final[1]+'-'+f_final[0];
      this._reportsservice.getReportPayments(this.report).subscribe(
        response => {
          if (response) {
            if(response == 'No existen'){
              this.reportInfo = [{'cliente_id': 'No hay datos'}];
            }else{
              this.reportInfo = response;
            }
          }
          setTimeout(() => {
            $('input').select();
          }, 300);
        },
        error => {
          var errortype = error.error;
            if(error.status === 400 || (error.status === 401 && !errortype.includes('SQLSTATE'))){
              localStorage.clear();
              window.location.href = '';
            }
        }
      );
    }
  }
}
