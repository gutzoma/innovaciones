import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { SearchService } from '../../_services/search.service';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

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
  selector: 'app-addpayment',
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
  templateUrl: './addpayment.component.html',
  styles: ``,
  providers: [
    SearchService,
    GeneralesService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
})
export class AddpaymentComponent {
  public search_cred_id!: any;
  public clientes: any;
  public payment: any;
  public asesor!: any;

  overlay = false;
  public config!: any;

  constructor(
    private _generalesservice: GeneralesService,
    private _searchservice: SearchService
  ) {
    this.payment = {};

    this.search_cred_id = '';
    this.config = {
      displayKey: 'name',
      search: true,
      searchPlaceholder: 'Buscar Cliente',
      clearOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.getSearch();
    $('input[name=p_credito]').blur(function () {
      $('input[name=cantidad]').val(
        parseFloat($('input[name=p_credito]').val()) +
          parseFloat($('input[name=p_mora]').val())
      );
    });
    $('input[name=p_mora]').blur(function () {
      $('input[name=cantidad]').val(
        parseFloat($('input[name=p_credito]').val()) +
          parseFloat($('input[name=p_mora]').val())
      );
    });
  }

  onSelectionChange(event: any) {
    this.search_cred_id = event.value.id;
    this.getCliente(this.search_cred_id);
  }

  getSearch() {
    var data = new Array();
    this._searchservice.getSearch().subscribe(
      (response) => {
        if (response != 'No existen') {
          response.forEach(function (cliente: any) {
            data.push({
              id: cliente.cliente_id,
              name:
                cliente.cliente_id +
                ' / ' +
                cliente.nombres +
                ' ' +
                cliente.paterno +
                ' ' +
                cliente.materno +
                ' / ' +
                cliente.curp,
            });
          });
          this.clientes = data;
        }
      },
      (error) => {
        console.log(<any>error);
        var errortype = error.error;
        if(error.status === 400 || (error.status === 401 && !errortype.includes('SQLSTATE'))){
          localStorage.clear();
          window.location.href = '';
        }
        alert('Error Valida que tu informacion sea correcta');
      }
    );
  }

  getCliente(cliente: number) {
    this._searchservice.getClienteSearch(cliente).subscribe(
      (response) => {
        this.payment.prestamo_id = response[0].prestamo_id;
        this.payment.cliente_id = cliente;
        this.payment.p_credito = response[0].pres_cuota;
        this.payment.p_mora = 0;
        this.payment.cantidad = response[0].pres_cuota;
        this.payment.number = '';
        $('input[name=fecha_payment]').val('');
        $('input[name=fecha_payment]').val('');
        setTimeout(() => {
          $('input').select();
        }, 300);
      },
      (error) => {
        console.log(<any>error);
        if(error.status === 401){
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }

  runInsertPayment(form: { reset: () => void }) {
    if ($('input[name=fecha_payment]').val() != '') {
      $('.add-payment').prop('disabled', true);
      var fecha_pay = $('input[name=fecha_payment]').val().split('-');
      this.payment.fecha_payment =
        fecha_pay[2] + '-' + fecha_pay[1] + '-' + fecha_pay[0];
      this.asesor = JSON.parse(localStorage.getItem('userData')!);
      this.asesor = this.asesor.id;
      this.payment.asesor = this.asesor;
      this.payment.cantidad = $('input[name=cantidad]').val();
      this._generalesservice.runInsertPayment(this.payment).subscribe(
        (response) => {
          if (response) {
            console.log(response);
            alert('Pago ingresado con exito');
            location.reload();
          }
        },
        (error) => {
          console.log(<any>error);
          alert('Revisa tu informacion');
          var errortype = error.error;
          if(error.status === 400 || (error.status === 401 && !errortype.includes('SQLSTATE'))){
            localStorage.clear();
            window.location.href = '';
          }
        }
      );
    } else {
      alert('Ingresa una fecha valida');
    }
  }
}
