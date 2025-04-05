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
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';

import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MenuComponent } from '../menu/menu.component';

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
  selector: 'app-cashbox',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SelectDropDownModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cashbox.component.html',
  styles: ``,
  providers: [
    SearchService,
    GeneralesService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class CashboxComponent {
  public search_cred_id!: any;
  public clientes: any;
  public payment: any;
  public asesor!: any;

  overlay = false;
  public config!: any;

  constructor(
    private _generalesservice: GeneralesService,
    private _searchservice: SearchService,
    public dialog: MatDialog
  ) {
    this.payment = {};
    this.payment.payment_type = 'Efectivo';
    this.payment.place = 'Oficina';

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
    $('input[name=p_credito]').blur(() => {
      $('input[name=cantidad]').val(
        parseFloat($('input[name=p_credito]').val()) +
          parseFloat($('input[name=p_mora]').val())
      );
      $('.textCantidadT').html(this.moneda($('input[name=cantidad]').val()));
    });
    $('input[name=p_mora]').blur(() => {
      $('input[name=cantidad]').val(
        parseFloat($('input[name=p_credito]').val()) +
          parseFloat($('input[name=p_mora]').val())
      );
      $('.textCantidadT').html(this.moneda($('input[name=cantidad]').val()));
    });
    $('input[name=cocept]').blur(function () {
      $('.concepto').html($('input[name=cocept]').val());
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
        if (error.status === 401) {
          localStorage.clear();
          window.location.href = '';
        }
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
        this.payment.nombres = response[0].nombres;
        this.payment.materno = response[0].materno;
        this.payment.paterno = response[0].paterno;

        $('input[name=fecha_payment]').val('');
        $('.textCantidadT').html(this.moneda(this.payment.cantidad));
        $('.cliente_name').html(
          response[0].nombres +
            ' ' +
            response[0].paterno +
            ' ' +
            response[0].materno
        );
        setTimeout(() => {
          $('input').select();
        }, 300);
      },
      (error) => {
        console.log(<any>error);
        if (error.status === 401) {
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }

  runInsertCashbox(form: { reset: () => void }) {
    if ($('#print_valid').prop('checked')) {
      if ($('input[name=fecha_payment]').val() != '') {
        $('.save-payment').prop('disabled', true);
        var fecha_pay = $('input[name=fecha_payment]').val().split('-');
        this.payment.fecha_payment =
          fecha_pay[2] + '-' + fecha_pay[1] + '-' + fecha_pay[0];
        this.asesor = JSON.parse(localStorage.getItem('userData')!);
        this.asesor = this.asesor.id;
        this.payment.asesor = this.asesor;
        this.payment.cantidad = $('input[name=cantidad]').val();

        this._generalesservice.runInsertCashbox(this.payment).subscribe(
          (response) => {
            if (response[0].Error) {
              this.modalInfo(response[0].Error, 'error');
            } else {
              this.modalInfo('Pago ingresado con exito', 'success');
              setTimeout(() => {
                location.reload();
              }, 2000);
            }
          },
          (error) => {
            var errortype = error.error;
            if (
              error.status === 400 ||
              (error.status === 401 && !errortype.includes('SQLSTATE'))
            ) {
              localStorage.clear();
              window.location.href = '';
            }
            this.modalInfo(
              'Error Valida que tu informacion sea correcta',
              'error'
            );
          }
        );
      } else {
        this.modalInfo('Ingresa una fecha valida', 'error');
      }
    } else {
      this.modalInfo('Valida la impresion del Recibo', 'error');
    }
  }

  printPage() {
    if ($('input[name=fecha_payment]').val() != '') {
      $('.fecha_recibo').html($('input[name=fecha_payment]').val());
      $('.forma_pago').html($('#payment_type').val());
      let printContents, popupWin;
      printContents = $('#agrrement-section').html();
      popupWin = window.open(
        '',
        '_blank',
        'top=20,left=20,height=100%,width=auto'
      );
      if (popupWin) {
        popupWin.document.open();
        popupWin.document.write(`
          <html>
              <body onload="window.print();window.close()" style="font-size: 15px;">${printContents}</body>
          </html>
        `);
        popupWin.document.close();
      }
    } else {
      this.modalInfo('Ingresa una fecha valida', 'error');
    }
  }

  moneda(dato: any) {
    let num: any;
    num = Math.round(dato);

    if (!isNaN(num)) {
      num = num
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1,');

      num = num.split('').reverse().join('').replace(/^[\,]/, '');

      return (dato = '$' + num);
    }
    return num;
  }
  modalInfo(info: any, tipo: any): void {
    this.dialog.open(ModalInfoComponent, {
      width: '500px',
      data: { info: info, tipo: tipo },
    });
  }
}
