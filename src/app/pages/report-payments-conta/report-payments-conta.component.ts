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
import * as ExcelJS from 'exceljs';

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
  selector: 'app-report-payments-conta',
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
  templateUrl: './report-payments-conta.component.html',
  styles: ``,
  providers: [
    GeneralesService,
    ReportsService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
})

export class ReportPaymentsContaComponent {

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
              $(".print-report").removeClass("disp-n");
            }
            setTimeout(() => {
              $('input').select();
            }, 300);
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
  }

  descargar(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla');

    const table:any = document.getElementById('miTabla');
    const rows:any = table.querySelectorAll('tr');
    rows.forEach((row: { querySelectorAll: (arg0: string) => any[]; }) => {
      const rowData: any[] = [];
      row.querySelectorAll('th, td').forEach((cell: { textContent: string; }) => {
        rowData.push(cell.textContent.trim());
      });
      worksheet.addRow(rowData);
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      this.saveExcelFile(buffer, 'tabla.xlsx');
    });
  }
  saveExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }


}
