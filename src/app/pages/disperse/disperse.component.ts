import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { CreditosService } from '../../_services/creditos.service';
import { SearchService } from '../../_services/search.service';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadService } from '../../_services/upload.service';
import { DataCredito } from '../../_models/datacredito';
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
  selector: 'app-disperse',
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
  templateUrl: './disperse.component.html',
  styles: ``,
  providers: [
    CreditosService,
    SearchService,
    GeneralesService,
    UploadService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class DisperseComponent {
  public des_cliente_id!: any;
  public clientes: any;
  public creditoInfo: any;
  public cred_fecha_pag!: string;
  public fechas_pagos!: any[];
  public data_credito: DataCredito;
  public comision!: any;
  public asesores!: any;
  public asesor!: any;
  public asesor_tab: any;
  public cuota: any;
  public fecha_p_final: any;
  public total_pagar: any;
  public sucursal: any;
  public ref: any;

  overlay = false;
  public config!: any;

  constructor(
    private _creditosservice: CreditosService,
    private _generalesservice: GeneralesService,
    public dialog: MatDialog
  ) {
    this.cred_fecha_pag = '';
    this.des_cliente_id = '';
    this.data_credito = new DataCredito(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    );

    this.des_cliente_id = '';
    this.config = {
      displayKey: 'name',
      search: true,
      searchPlaceholder: 'Bucar Cliente',
      clearOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.getClientesApro();
    this.getAsesores();

    $('input[name=amortizacion]').click(() => {
      if ($('input[name=fecha_pag]').val() == '') {
        this.modalInfo('ingresa una fecha valida', 'error');
      }
      let fecha_des = $('input[name=fecha_des]').val().split('-');
      fecha_des = new Date(fecha_des[2], fecha_des[1] - 1, fecha_des[0]);

      let fecha_pag = $('input[name=fecha_pag]').val().split('-');
      fecha_pag = new Date(fecha_pag[2], fecha_pag[1] - 1, fecha_pag[0]);

      let no_dias = fecha_pag - fecha_des;

      no_dias =
        no_dias / (1000 * 60 * 60 * 24) +
        parseFloat(this.data_credito.plazo_cuotas) *
          parseFloat(this.data_credito.plazo_days);

      no_dias = no_dias - parseFloat(this.data_credito.plazo_days);

      let int_total =
        (no_dias * (parseFloat(this.data_credito.int_aut) / 30)) / 100;
      this.fechas_pagos = new Array();
      let no_pagos = parseFloat(this.data_credito.plazo_cuotas);
      let monto = this.data_credito.mont_aut;

      let cuota =
        (parseFloat(monto) * int_total + parseFloat(monto)) / no_pagos;
      fecha_pag.setDate(fecha_pag.getDate());
      for (let i = 0; i < no_pagos; i++) {
        this.fechas_pagos.push({
          no: i + 1,
          cuota: Math.round(cuota),
          saldo: Math.round(
            parseFloat(monto) * int_total + parseFloat(monto) - cuota * i
          ),
          fecha: fecha_pag.toLocaleDateString('es-MX'),
        });
        fecha_pag.setDate(
          fecha_pag.getDate() + parseFloat(this.data_credito.plazo_days)
        );
      }
      this.comision = (parseFloat(monto) * 3) / 100;
      this.comision = parseFloat(this.comision + this.comision * 0.16);

      let cuotas = this.fechas_pagos;
      let info_cuota: { cuota: any; fecha: any; total_pagar: any }[] = [];
      cuotas.forEach((cuota: any) => {
        if (cuota.no == no_pagos) {
          info_cuota.push({
            cuota: cuota.cuota,
            fecha: cuota.fecha,
            total_pagar: parseFloat(cuota.cuota) * no_pagos,
          });
        }
      });

      this.cuota = info_cuota[0]['cuota'];
      this.fecha_p_final = info_cuota[0]['fecha'];
      this.total_pagar = info_cuota[0]['total_pagar'];

      $('.legales').removeAttr('style');

      $('#fechaTab').html($('input[name=fecha_des]').val());
      let dias = [
        { id: 1, dia: 'lunes' },
        { id: 2, dia: 'Martes' },
        { id: 3, dia: 'Miercoles' },
        { id: 4, dia: 'Jueves' },
        { id: 5, dia: 'Viernes' },
      ];

      let fecha_tab = $('input[name=fecha_pag]').val().split('-');
      fecha_tab = fecha_tab[1] + '-' + fecha_tab[0] + '-' + fecha_tab[2];
      fecha_tab = new Date(fecha_tab);
      fecha_tab = fecha_tab.getDay();

      dias.forEach((dia: any) => {
        if (dia.id == fecha_tab) {
          $('.diasTab').html(dia.dia);
        }
      });
    });

    $('#vigente').change(() => {
      if ($('#vigente').prop('checked')) {
        $('#desembolsar').removeAttr('disabled');
      } else {
        $('#desembolsar').prop('disabled', true);
      }
    });

    $('#textFecha').blur(() => {
      $('.textFecha').html($('#textFecha').val());
    });
    $('#textCantidad').blur(() => {
      $('#textCantidad2').html($('#textCantidad').val());
    });
    $('#textCantidadT').blur(() => {
      $('.textCantidadT').html($('#textCantidadT').val());
    });
  }

  onSelectionChange(event: any) {
    this.des_cliente_id = event.value.id;
    this.getCreditoDes(this.des_cliente_id);
    this.comision = 'Por calcular';
  }

  getClientesApro() {
    var data = new Array();
    this._creditosservice.getClientesApro().subscribe(
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

  getCreditoDes(cliente: number) {
    this._creditosservice.getCreditoDes(cliente).subscribe(
      (response) => {
        if (response) {
          this.creditoInfo = response;
          if (response) {
            $('#idCli').html(response[0].curp);
            $('#noCreCli').html(parseFloat(response[0].no_credito) + 1);

            this.data_credito = {
              cliente_id: response[0].cliente_id,
              asesor: response[0].asesor,
              calle: response[0].calle,
              colonia: response[0].colonia,
              cp: response[0].cp,
              curp: response[0].curp,
              desembolsado: response[0].desembolsado,
              destino: response[0].destino,
              estado: response[0].estado,
              fecha_de_nacimiento: response[0].fecha_de_nacimiento,
              fecha_des: response[0].fecha_des,
              ine: response[0].ine,
              int_aut: response[0].int_aut,
              materno: response[0].materno,
              metodo_aut: response[0].metodo_aut,
              mont_aut: response[0].mont_aut,
              municipio: response[0].municipio,
              no_credito: response[0].no_credito,
              nombres: response[0].nombres,
              numero: response[0].numero,
              paterno: response[0].paterno,
              plazo_cuotas: response[0].plazo_cuotas,
              plazo_name: response[0].plazo_name,
              plazo_days: response[0].plazo_days,
              plazo_periodos: response[0].plazo_periodos,
              telefono: response[0].telefono,
              vigente: '',
              fecha_pag: '',
              total_p: '',
              garantia: response[0].garantia,
              garantia_des: response[0].garantia_des,
              cod_nombre: response[0].cod_nombre,
              cod_paterno: response[0].cod_paterno,
              cod_materno: response[0].cod_materno,
              cod_calle: response[0].cod_calle,
              cod_numero: response[0].cod_numero,
              cod_municipio: response[0].cod_municipio,
              cod_colonia: response[0].cod_colonia,
              cod_estado: response[0].cod_estado,
              cod_cp: response[0].cod_cp,
            };

            setTimeout(() => {
              $('input[name=fecha_des]').val(response[0].fecha_des);
              $('#formEdit').removeClass('disp-n');
              this.fechas_pagos = [];
              $('input').select();
              $('input[name=fecha_pag]').val('');
            }, 300);

            this.asesores.forEach((asesor: any) => {
              if (this.data_credito.asesor == asesor.id) {
                $('#asesorName').html(
                  asesor.nombres + ' ' + asesor.paterno + ' ' + asesor.materno
                );
                this.sucursal = asesor.sucursal;
              }
            });

            $('#montoTab').html(this.data_credito.mont_aut);
            $('#FrecuenciaTab').html(this.data_credito.plazo_periodos);
            $('#NoClienteTab').html(this.data_credito.cliente_id);

            $('.legales').css('display', 'none');

            this.ref = parseInt(this.data_credito.cliente_id);
          }
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
        this.modalInfo('Error Valida que tu informacion sea correcta', 'error');
      }
    );
  }

  saveDesem(form: { reset: () => void }) {
    $('#desembolsar').prop('disabled', true);
    var fecha_pag = $('input[name=fecha_pag]').val().split('-');
    this.data_credito.fecha_pag =
      fecha_pag[2] + '-' + fecha_pag[1] + '-' + fecha_pag[0];
    var fecha_des = $('input[name=fecha_des]').val().split('-');
    this.data_credito.fecha_des =
      fecha_des[2] + '-' + fecha_des[1] + '-' + fecha_des[0];
    var fechas_pagos = this.fechas_pagos[0]['fecha'].split('/');
    this.fechas_pagos[0]['fecha'] =
      fechas_pagos[2] + '-' + fechas_pagos[1] + '-' + fechas_pagos[0];
    this.data_credito.total_p =
      this.fechas_pagos[0]['cuota'] *
      parseFloat(this.data_credito.plazo_cuotas);

    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.asesor = { id: this.asesor.id, sucursal: this.sucursal };

    this._creditosservice
      .createPrest(this.data_credito, this.fechas_pagos[0], this.asesor)
      .subscribe(
        (response) => {
          if (response[0].Error != '') {
            this.modalInfo(response[0].Error, 'error');
          } else {
            this.modalInfo('Registro Exitoso', 'success');
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
        }
      );
    //form.reset();
  }

  getAsesores() {
    this._generalesservice.getAsesores().subscribe(
      (response) => {
        if (response) {
          this.asesores = response;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  printPage() {
    let printContents, popupWin;
    printContents = $('#agrrement-section').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
				<html>
            <body onload="window.print();window.close()" style="font-size: 12px;">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }
  printPage2() {
    let printContents, popupWin;
    printContents = $('#agrrement-section2').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
				<html>
            <body onload="window.print();window.close()">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }
  printPage3() {
    $('.totalPagoI').html(
      this.moneda(parseFloat(this.comision) + parseFloat(this.cuota))
    );

    let printContents, popupWin;
    printContents = $('#agrrement-section3').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
				<html>
            <body onload="window.print();window.close()" style="font-size: 13px;">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }
  printPage4() {
    let printContents, popupWin;
    printContents = $('#agrrement-section4').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
				<html>
            <body onload="window.print();window.close()" style="font-size: 12px;">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
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
