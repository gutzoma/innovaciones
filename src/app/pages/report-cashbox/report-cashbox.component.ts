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
  selector: 'app-report-cashbox',
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
  templateUrl: './report-cashbox.component.html',
  styles: ``,
  providers: [
    GeneralesService,
    ReportsService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
})
export class ReportCashboxComponent {

  public report: Report;
  public reportInfo!: any;
  public t_ofi: any;
  public t_cam: any;
  public t_gen: any;
  public t_number: any;
  public fechaHoy: any;

  constructor(private _generalesservice: GeneralesService, private _reportsservice: ReportsService) {
    
    this.report = new Report('', '', '', '');
    this.t_ofi =  0;
    this.t_cam =  0;
    this.t_gen =  0;
    this.t_number =  0;
    this.fechaHoy = new Date().toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"long", day:"numeric"});
   }

   date : any;

   ngOnInit(): void {

   }


  getReportCashBox(form: { reset: () => void; }){
    if($("input[name=f_inicial]").val() == '' || $("input[name=f_final]").val() == '') {
     alert('ingresa fechas validas')
    }else{
      var f_inicial:any = $("input[name=f_inicial]").val();
      f_inicial = f_inicial.split("-");
      this.report.f_inicial = f_inicial[2]+'-'+f_inicial[1]+'-'+f_inicial[0];
      var f_final:any = $("input[name=f_final]").val();
      f_final = f_final.split("-");
      this.report.f_final = f_final[2]+'-'+f_final[1]+'-'+f_final[0];
      this._reportsservice.getReportCashBox(this.report).subscribe(
        response => {
          if(response == 'No existen'){
            this.reportInfo = [{'cliente_id': 'No hay datos'}];
          }else{
            this.reportInfo = response;

            var ofi = 0;
            var cam = 0;

            this.reportInfo.forEach( (element: any) => {
              if(element.lugar == "Oficina"){
                ofi += parseFloat(element.cantidad);
              }else{
                cam += parseFloat(element.cantidad);
              }
            });

            this.t_ofi = this.moneda(ofi);
            this.t_cam = this.moneda(cam);
            this.t_gen = this.moneda(ofi + cam);
            this.t_number = ofi + cam;
          }
          $(".totales").css("display", "inherit");
          setTimeout(() => {
            $('input').select();
          }, 300);
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

  printPage() {
    $(".entrega").html($(".v_entrega").val());
    $(".recibe").html($(".v_recibe").val());
    let printContents, popupWin;
    printContents = $('#agrrement-section3').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write('<link rel="stylesheet" href="http://localhost:4200/styles.css">'); 
      popupWin.document.write(`
				<html>
            <body onload="window.print();window.close()" style="font-size: 10px; !important">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }

  sumEfectivo() {
    $(".mil").html($(".val1").val());
    $(".milt").html($(".val1").val() * 1000);
    $(".quin").html($(".val2").val());
    $(".quint").html($(".val2").val() * 500);
    $(".dosi").html($(".val3").val());
    $(".dosit").html($(".val3").val() * 200);
    $(".cien").html($(".val4").val());
    $(".cient").html($(".val4").val() * 100);
    $(".cin").html($(".val5").val());
    $(".cint").html($(".val5").val() * 50);
    $(".vein").html($(".val6").val());
    $(".veint").html($(".val6").val() * 20);
    $(".diez").html($(".val7").val());
    $(".diezt").html($(".val7").val() * 10);
    $(".cinco").html($(".val8").val());
    $(".cincot").html($(".val8").val() * 5);
    $(".dos").html($(".val9").val());
    $(".dost").html($(".val9").val() * 2);
    $(".uno").html($(".val10").val());
    $(".unot").html($(".val10").val() * 1);

    $(".tEfectivo").val(
      ($(".val1").val() * 1000)
      + ($(".val2").val() * 500)
      + ($(".val3").val() * 200)
      + ($(".val4").val() * 100)
      + ($(".val5").val() * 50)
      + ($(".val6").val() * 20)
      + ($(".val7").val() * 10)
      + ($(".val8").val() * 5)
      + ($(".val9").val() * 2)
      + ($(".val10").val() * 1)
    )

    var suma = ($(".val1").val() * 1000)
    + ($(".val2").val() * 500)
    + ($(".val3").val() * 200)
    + ($(".val4").val() * 100)
    + ($(".val5").val() * 50)
    + ($(".val6").val() * 20)
    + ($(".val7").val() * 10)
    + ($(".val8").val() * 5)
    + ($(".val9").val() * 2)
    + ($(".val10").val() * 1);
 
    $(".t_efect").html( this.moneda(suma));
    var diff = this.t_number - suma;
    $(".difer").html(this.moneda(diff));

  }

  moneda(dato: any) {
    let num: any;
    num = Math.round(dato);

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1,");

      num = num.split("").reverse().join("").replace(/^[\,]/, "");

      return (dato = "$" + num);
    }
    return num;
  }
}