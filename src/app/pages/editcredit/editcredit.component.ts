import { Component } from '@angular/core';
import { CreditosService } from '../../_services/creditos.service';
import { ClienteCredito } from '../../_models/credito';
import { GeneralesService } from '../../_services/generales.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';

declare let $: any;
@Component({
  selector: 'app-editcredit',
  imports: [FormsModule, CommonModule, SelectDropDownModule],
  standalone: true,
  templateUrl: './editcredit.component.html',
  styles: ``,
  providers: [CreditosService, GeneralesService, CreditosService],
})
export class EditcreditComponent {
  public cliente_cred_id!: any;
  public data: any;
  public clientes: any;
  public creditoInfo: any;
  public clientecredito: ClienteCredito;
  public edit_credito: any;
  public status!: string;
  public plazos: any;

  overlay = false;
  public config!: any;

  constructor(
    private _creditosservice: CreditosService,
    private _generalesservice: GeneralesService
  ) {
    this.cliente_cred_id = '';
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

    this.cliente_cred_id = '';
    this.config = {
      displayKey: 'name',
      search: true,
      searchPlaceholder: 'Buscar Cliente',
      clearOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.getCreditos();
    this.getTplazo();
  }

  onSelectionChange(event: any) {
    this.cliente_cred_id = event.value.id;
    this.getCredito(this.cliente_cred_id);
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
              '',
              response[0].monto_sol,
              response[0].plazo_sol,
              response[0].metodo_sol,
              response[0].destino,
              response[0].nombre,
              response[0].parentesco,
              response[0].comentario,
              response[0].direccion,
              response[0].telefono,
              response[0].nombre2,
              response[0].parentesco2,
              response[0].comentario2,
              response[0].direccion2,
              response[0].telefono2,
              response[0].nombre3,
              response[0].parentesco3,
              response[0].comentario3,
              response[0].direccion3,
              response[0].telefono3,
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              ''
            );

            setTimeout(() => {
              $('input[name=cred_fecha_aut]').val(response[0].fecha_des);
              $('#formEdit').removeClass('disp-n');
              $('input').select();
            }, 300);
          }
        }
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
        if(error.status === 401){
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }

  editCredit(form: { reset: () => void }) {
    // Actualizar Credito

    this.clientecredito.cred_cli_id = this.cliente_cred_id;
    this._creditosservice.editCredito(this.clientecredito).subscribe(
      (response) => {
        if (response) {
          this.edit_credito = response;
          this.status = 'success';
          alert('Registro exitoso');
          location.reload();
        } else {
          this.status = 'failed';
        }
      },
      (error) => {
        var errortype = error.error;
        if(error.status === 400 || (error.status === 401 && !errortype.includes('SQLSTATE'))){
          localStorage.clear();
          window.location.href = '';
        }
        alert('Error Valida que tu informacion sea correcta');
      }
    );
  }
}
