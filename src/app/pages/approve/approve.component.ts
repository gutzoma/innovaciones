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
import { ClienteCredito } from '../../_models/credito';
import { ClienteGarantia } from '../../_models/garantia';
import { Global } from '../../_services/global';
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
  selector: 'app-approve',
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
  templateUrl: './approve.component.html',
  styles: ``,
  providers: [
    CreditosService,
    SearchService,
    GeneralesService,
    UploadService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
})
export class ApproveComponent {
  public apro_cliente_id!: any;
  public data: any;
  public clientes: any;
  public creditoInfo: any;
  public clientecredito: ClienteCredito;
  public save_credito: any;
  public status!: string;
  public asesores!: any;
  public plazos: any;
  public clientegarantia: ClienteGarantia;
  public asesor!: any;

  overlay = false;
  public config!: any;

  public filesToUpload1!: Array<File>;

  constructor(
    private _creditosservice: CreditosService,
    private _generalesservice: GeneralesService,
    private _uploadservice: UploadService
  ) {
    this.apro_cliente_id = '';
    this.clientegarantia = new ClienteGarantia('', '', '');
    this.clientecredito = new ClienteCredito(
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

    this.apro_cliente_id = '';
    this.config = {
      displayKey: 'name',
      search: true,
      searchPlaceholder: 'Bucar Cliente',
      clearOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.getCreditos();
    this.getAsesores();
    this.getTplazo();
  }

  onSelectionChange(event: any) {
    this.apro_cliente_id = event.value.id;
    this.getCredito(this.apro_cliente_id);
  }

  getTplazo() {
    this._generalesservice.getTplazo().subscribe(
      (response) => {
        if (response) {
          this.plazos = response;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  getCredito(cliente: number) {
    this._creditosservice.getCredito(cliente).subscribe(
      (response) => {
        if (response) {
          this.creditoInfo = response;
          if (response) {
            $('#idCli').html(response[0].curp);
            $('#noCreCli').html(parseFloat(response[0].no_credito) + 1);

            this.clientecredito = new ClienteCredito(
              $('#apro_cliente_id option:selected').val(),
              response[0].monto_sol,
              response[0].plazo_sol,
              response[0].metodo_sol,
              response[0].destino,
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
              response[0].desembolsado.toString(),
              '',
              '',
              '',
              '',
              '',
              '',
              ''
            );

            setTimeout(() => {
              $('#formEdit').removeClass('disp-n');
              $('input').select();
            }, 300);
          }
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

  getCreditos() {
    var data = new Array();
    this._creditosservice.getCreditos().subscribe(
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

  upCredit(form: { reset: () => void }) {
    if (this.clientecredito.cred_status == '0') {
      alert('Cambia el Estado del Credito');
    } else {
      if (this.filesToUpload1) {
        this.clientegarantia.garantia_img = this.filesToUpload1[0].name;
      } else {
        this.clientegarantia.garantia_img = '';
        this.clientegarantia.garantia_avaluo = '0';
        this.clientegarantia.garantia_des = '';
      }
      this.clientecredito.cred_cli_id = this.apro_cliente_id;

      this.asesor = JSON.parse(localStorage.getItem('userData')!);
      this.asesor = { id: this.asesor.id };
      var cred_fecha_aut = $('input[name=cred_fecha_aut]').val().split('-');
      this.clientecredito.cred_fecha_aut =
        cred_fecha_aut[2] + '-' + cred_fecha_aut[1] + '-' + cred_fecha_aut[0];
      if (this.clientecredito.cred_garantia) {
        this.clientecredito.cred_garantia = '1';
      } else {
        this.clientecredito.cred_garantia = '0';
      }

      this._creditosservice
        .upCredit(this.clientecredito, this.clientegarantia, this.asesor)
        .subscribe(
          (response) => {
            if (response) {
              this.save_credito = response;
              this.status = 'success';
              if ($("input[type='checkbox']").is(':checked')) {
                this._uploadservice
                  .makeFileRequest(
                    Global.url + 'save-img/garantia',
                    [],
                    this.filesToUpload1,
                    'image'
                  )
                  .then((result: any) => {});
              }
              alert('Registro exitoso');
              location.reload();
            } else {
              this.status = 'failed';
            }
          },
          (error) => {
            //console.log(<any>error.error);
            console.log(<any>error);
            if (error.status === 401) {
              localStorage.clear();
              window.location.href = '';
            }
            var errortype = error.error;
            if (
              errortype.includes('Duplicate entry') &&
              errortype.includes('curp')
            ) {
              alert('Error');
            } else {
              alert('Error, Intente nuevamente');
            }
          }
        );
      form.reset();
    }
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
  fileChangeEvent1(fileInput: any) {
    this.filesToUpload1 = <Array<File>>fileInput.target.files;
  }

  checkClickFunc() {
    var checkbox = $('.cred_garantia').prop('checked');
    if (checkbox) {
      $('.warranty').removeClass('disp-n');
    } else {
      $('.warranty').addClass('disp-n');
    }
  }
}
