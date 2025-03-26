import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../_models/cliente';
import { ClienteService } from '../../_services/cliente.service';
import { GeneralesService } from '../../_services/generales.service';
import { UploadService } from '../../_services/upload.service';
import { CreditosService } from '../../_services/creditos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteCodeudor } from '../../_models/codeudor';
import { ClienteNegocio } from '../../_models/negocio';
import { SelectDropDownModule } from 'ngx-select-dropdown'
declare let $: any;

@Component({
  selector: 'app-editclient',
  imports: [FormsModule, CommonModule,SelectDropDownModule],
  standalone: true,
  templateUrl: './editclient.component.html',
  styles: ``,
  providers: [ClienteService, GeneralesService, UploadService, CreditosService]
})
export class EditclientComponent {

  public clientes: any;
  public clienteInfo: any;
  public save_credito: any;
  public status!: string;
  public cliente_id!: string;
  public data: any;
  public cliente: Cliente;
  public clientecodeudor: ClienteCodeudor;
  public clientenegocio: ClienteNegocio;
  public save_cliente: any;

  public sexo!: any;
  public vivienda!: any;
  public negocio!: any;
  public edociv!: any;
  public sucursales!: any;

  overlay = false;
  public config!:any;
  
  constructor(private _creditosservice: CreditosService,
    private _clienteservice: ClienteService,
    private _generalesservice: GeneralesService) {
    this.cliente = new Cliente('','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','');

    this.clientecodeudor = new ClienteCodeudor('', '', '', '', ''
      , '', '', '', '', '', '', '', '', '', '', '', '', ''
      , '', '', '', '');

    this.clientenegocio = new ClienteNegocio('', '', '', '', ''
      , '', '', '', '', '', '', '', '');

    this.cliente_id = '';
    this.config = {
      displayKey: "name",
      search: true,
      searchPlaceholder:'Buscar Cliente',
      clearOnSelection: true
    };
  }

  ngOnInit(): void {
    this.getClientes();

    this.getTcliente();
    this.getTvivienda();
    this.getTnegocio();
    this.getTedociv();
    this.getSucursales();

    $("input[name=sol_curp]").blur(() => {
      var nac = $("input[name=sol_curp]").val().substr(4, 6);
      nac = this.agregarCaracter(nac, "-", 2);
      nac = nac.split("-");
      $("input[name=sol_fecha_nac]").val(nac[0] + '-' + nac[1] + '-' + nac[2]);
    });

    $("input[name=cod_curp]").blur(() => {
      var nac2 = $("input[name=cod_curp]").val().substr(4, 6);
      nac2 = this.agregarCaracter(nac2, "-", 2);
      nac2 = nac2.split("-");
      $("input[name=cod_fecha_nac]").val(nac2[0] + '-' + nac2[1] + '-' + nac2[2]);
    });
    
  }

  onSelectionChange(event: any) {
    this.cliente_id = event.value.id;
    this.getCliente(this.cliente_id); 

  }

  getClientes() {
    var data = new Array();
    this._creditosservice.getClientes().subscribe(
      response => {
        if (response != 'No existen') {
          response.forEach(function (cliente: any) {
            data.push({
              'id': cliente.cliente_id,
              'name': cliente.cliente_id + ' / ' + cliente.nombres + ' ' + cliente.paterno + ' ' + cliente.materno + ' / ' + cliente.curp
            });
          });
          this.clientes = data;
        }
      },
      error => {
        if(error.status === 401){
          localStorage.clear();
          window.location.href = '';
        }
        console.log(<any>error);
      }
    );
  }
  

  getCliente(cliente: any) {
    this._creditosservice.getCliente(cliente).subscribe(
      response => {
        if (response) {
          this.clienteInfo = response;
          if (response) {
            $("#idCli").html(response[0].curp);
            $("#noCreCli").html(parseFloat(response[0].no_credito) + 1);

            this.cliente = new Cliente(
              response[0].sucursal,
              response[0].nombres,
              response[0].paterno,
              response[0].materno,
              response[0].correo,
              response[0].social,
              response[0].telefono,
              response[0].telefono2,
              response[0].no_dependientes,
              response[0].curp,
              response[0].ine,
              '',
              response[0].sexo,
              response[0].estado_civil,
              response[0].tipo_de_vivienda,
              response[0].calle,
              response[0].numero,
              response[0].colonia,
              response[0].municipio,
              response[0].estado,
              response[0].cp,
              response[0].descripcion,
              response[0].ubicacion);

            this.clientecodeudor = new ClienteCodeudor(
              response[0].cod_nombres,
              response[0].cod_paterno,
              response[0].cod_materno,
              response[0].cod_parentesco,
              response[0].cod_telefono,
              response[0].cod_telefono2,
              response[0].cod_ocupacion,
              response[0].cod_ingresos,
              response[0].cod_curp,
              response[0].cod_ine,
              '',
              response[0].cod_sexo,
              response[0].cod_estado_civil,
              response[0].cod_tipo_de_vivienda,
              response[0].cod_calle,
              response[0].cod_numero,
              response[0].cod_colonia,
              response[0].cod_municipio,
              response[0].cod_estado,
              response[0].cod_cp,
              response[0].cod_descripcion,
              response[0].cod_ubicacion
            );

            this.clientenegocio = new ClienteNegocio(
              response[0].neg_tipo,
              response[0].neg_giro,
              response[0].neg_ingreso,
              response[0].neg_telefono,
              response[0].neg_calle,
              response[0].neg_numero,
              response[0].neg_colonia,
              response[0].neg_municipio,
              response[0].neg_estado,
              response[0].neg_cp,
              response[0].neg_descripcion,
              response[0].neg_ubicacion,
              response[0].neg_horario
            );

            setTimeout(() => {
              $("input[name=sol_fecha_nac]").val(response[0].fecha_de_nacimiento);
              $("input[name=cod_fecha_nac]").val(response[0].cod_fecha_de_nacimiento);
              $("#formEdit").removeClass('disp-n');
              $("input").select();
            }, 300);
          }
        }
      },
      error => {
        console.log(<any>error);
        if(error.status === 401){
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }
  saveClient(form: { reset: () => void; }) {
    this.cliente.sol_fecha_nac = $("input[name=sol_fecha_nac]").val();
    this.clientecodeudor.cod_fecha_nac = $("input[name=cod_fecha_nac]").val();

    // Actuaalizar Cliente
		this._clienteservice.upCliente(this.cliente, this.clientecodeudor, this.clientenegocio, this.cliente_id).subscribe(
			response => {
				if(response){
          this.save_cliente = response;
          this.status = 'success';
          alert('Registro exitoso');
          location.reload();
				}else{
					this.status = 'failed';
				}
			},
			error => {
				//console.log(<any>error.error);
        var errortype = error.error;
        if (errortype.includes('Duplicate entry') && errortype.includes('curp')){
                alert('Curp Duplicada');
        }else{
          alert('Error, Intente nuevamente');
        }
			}
		);
  }

  getTcliente() {
    this._generalesservice.getTcliente().subscribe(
      response => {
        if (response) {
          this.sexo = response;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getTvivienda() {
    this._generalesservice.getTvivienda().subscribe(
      response => {
        if (response) {
          this.vivienda = response;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getTnegocio() {
    this._generalesservice.getTnegocio().subscribe(
      response => {
        if (response) {
          this.negocio = response;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getTedociv() {
    this._generalesservice.getTedociv().subscribe(
      response => {
        if (response) {
          this.edociv = response;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getSucursales() {
    this._generalesservice.getSucursales().subscribe(
      (response) => {
        if (response) {
          this.sucursales = response;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

    agregarCaracter = (cadena: string, caracter: any, pasos: number) => {
    let cadenaConCaracteres = "";
    const longitudCadena = cadena.length;
    for (let i = 0; i < longitudCadena; i += pasos) {
        if (i + pasos < longitudCadena) {
            cadenaConCaracteres += cadena.substring(i, i + pasos) + caracter;
        } else {
            cadenaConCaracteres += cadena.substring(i, longitudCadena);
        }
    }
    return cadenaConCaracteres;
}

}
