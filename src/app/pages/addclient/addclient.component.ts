import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../_models/cliente';
import { ClienteService } from '../../_services/cliente.service';
import { GeneralesService } from '../../_services/generales.service';
import { UploadService } from '../../_services/upload.service';
import { Global } from '../../_services/global';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteCodeudor } from '../../_models/codeudor';
import { ClienteNegocio } from '../../_models/negocio';
declare let $: any;


@Component({
  selector: 'app-addclient',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './addclient.component.html',
  styles: ``,
  providers: [ClienteService, GeneralesService, UploadService]
})
export class AddclientComponent implements OnInit {
  public data: any;
  public cliente: Cliente;
  public clientecodeudor: ClienteCodeudor;
  public clientenegocio: ClienteNegocio;
  public save_cliente: any;
	public status!: string;
  public sexo!: any;
  public vivienda!: any;
  public negocio!: any;
  public edociv!: any;

  public asesor!: any;
  public sucursales!: any;
  public imgs!: any;

  public filesToUpload1!: Array<File>;
  public filesToUpload2!: Array<File>;
  public filesToUpload3!: Array<File>;

  constructor(
    private _clienteservice: ClienteService,
    private _generalesservice: GeneralesService,
    private _uploadservice: UploadService
  ) 
  {
    this.cliente = new Cliente('','','','','','','','','','','','','','','','','','','','','','','');

    this.clientecodeudor = new ClienteCodeudor('','','','',''
    ,'','','','','','','','','','','','',''
    ,'','','','');

    this.clientenegocio = new ClienteNegocio('','','','',''
    ,'','','','','','','','');


  }
  date : any;
  ngOnInit(): void {
    this.getTcliente();
    this.getTvivienda();
    this.getTnegocio();
    this.getTedociv();
    this.getSucursales();
    $("input[name=sol_curp]").blur(() =>{
      var nac = $("input[name=sol_curp]").val().substr(4,6);
      nac = this.agregarCaracter(nac, "-", 2);
      nac = nac.split("-");
      $("input[name=sol_fecha_nac]").val(nac[0]+'-'+nac[1]+'-'+nac[2]);
  });

  $("input[name=cod_curp]").blur(() =>{
    var nac2 = $("input[name=cod_curp]").val().substr(4,6);
    nac2 = this.agregarCaracter(nac2, "-", 2);
    nac2 = nac2.split("-");
    $("input[name=cod_fecha_nac]").val(nac2[0]+'-'+nac2[1]+'-'+nac2[2]);
});

  $(".custom-file-input1").on("change", function() {
    var fileName = $(".custom-file-input1").val().split("\\").pop();
    $(".custom-file-input1").siblings(".custom-file-label1").addClass("selected").html(fileName);
  });
  $(".custom-file-input2").on("change", function() {
    var fileName = $(".custom-file-input2").val().split("\\").pop();
    $(".custom-file-input2").siblings(".custom-file-label2").addClass("selected").html(fileName);
  });
  $(".custom-file-input3").on("change", function() {
    var fileName = $(".custom-file-input3").val().split("\\").pop();
    $(".custom-file-input3").siblings(".custom-file-label3").addClass("selected").html(fileName);
  });  

  }
  saveClient(form: { reset: () => void; }){

     this.cliente.sol_fecha_nac = $("input[name=sol_fecha_nac]").val();
     this.clientecodeudor.cod_fecha_nac = $("input[name=cod_fecha_nac]").val();

    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.asesor = {'id':this.asesor.id, 'sucursal':this.asesor.sucursal};

    this.imgs = {
      'ine':this.filesToUpload1[0].name,
      'curp':this.filesToUpload2[0].name,
      'domicilio':this.filesToUpload3[0].name};

		this._clienteservice.saveCliente(this.cliente, this.clientecodeudor, this.clientenegocio, this.asesor, this.imgs).subscribe(
			response => {
				if(response){
          this.save_cliente = response;
          
          this._uploadservice.makeFileRequest(Global.url+'save-img/ine', [], this.filesToUpload1, 'image').then((result:any) => {});
          this._uploadservice.makeFileRequest(Global.url+'save-img/curp', [], this.filesToUpload2, 'image').then((result:any) => {});
          this._uploadservice.makeFileRequest(Global.url+'save-img/domicilio', [], this.filesToUpload3, 'image').then((result:any) => {});
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
    //form.reset();
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
  fileChangeEvent1(fileInput:any){
    this.filesToUpload1 = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload1);
  }
  fileChangeEvent2(fileInput:any){
    this.filesToUpload2 = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload2);
  }
  fileChangeEvent3(fileInput:any){
    this.filesToUpload3 = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload3);
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

