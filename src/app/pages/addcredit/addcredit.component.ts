import { Component } from '@angular/core';
import { CreditosService } from '../../_services/creditos.service';
import { ClienteCredito } from '../../_models/credito';
import { GeneralesService } from '../../_services/generales.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';

declare let $: any;
@Component({
  selector: 'app-addcredit',
  imports: [FormsModule, CommonModule, SelectDropDownModule],
  standalone: true,
  templateUrl: './addcredit.component.html',
  styles: ``,
  providers: [CreditosService, GeneralesService],
})
export class AddcreditComponent {
  public clientes: any;
  public clienteInfo: any;
  public clientecredito: ClienteCredito;
  public save_credito: any;
  public status!: string;
  public plazos: any;
  public asesor!: any;
  public cred_cli_id!: any;

  overlay = false;
  public config!: any;

  constructor(
    private _creditosservice: CreditosService,
    private _generalesservice: GeneralesService
  ) {
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

    this.cred_cli_id = '';
    this.config = {
      displayKey: 'name',
      search: true,
      searchPlaceholder: 'Bucar Cliente',
      clearOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.getClientesCred();
    this.getTplazo();
  }

  onSelectionChange(event: any) {
    this.cred_cli_id = event.value.id;
    this.getCliente(this.cred_cli_id);
  }

  getClientesCred() {
    var data = new Array();
    this._creditosservice.getClientesCred().subscribe(
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

  getCliente(cred_cli_id: any) {
    this._creditosservice.getCliente(cred_cli_id).subscribe(
      (response) => {
        if (response) {
          this.clienteInfo = response;
          if (response) {
            $('#idCli').html(response[0].curp);
            $('#noCreCli').html(parseFloat(response[0].no_credito) + 1);
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

  saveCredit(form: { reset: () => void }) {
    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.asesor = { id: this.asesor.id };
    if (this.cred_cli_id > 0) {
      this.clientecredito.cred_cli_id = this.cred_cli_id;
      this._creditosservice
        .saveCredit(this.clientecredito, this.asesor)
        .subscribe(
          (response) => {
            if (response) {
              this.save_credito = response;
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
    } else {
      alert('Ocurrio un error intenta nuevamente');
    }
  }
}
