import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SearchService } from '../../_services/search.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TabsModule} from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";

declare let $: any;
@Component({
  selector: 'app-search',
  imports: [SelectDropDownModule, TabsModule, CommonModule, MenuComponent],
  templateUrl: './search.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[SearchService]
})
export class SearchComponent {

  public clientes: any;
  public id_search: any;
  public clienteInfo: any;
  public pagos: any;
  public save_credito: any;
	public status!: string;
  public datos_credito!: any;
  public pagos_sum!: any;

overlay = false;
public config!:any;

  constructor(
    private _searchservice: SearchService,
    private cdr: ChangeDetectorRef
  ) {
    this.id_search = '';
    this.config = {
      displayKey: "name",
      search: true,
      searchPlaceholder:'Buscar Cliente',
      clearOnSelection: true
    };
  }
  ngOnInit(): void {
    this.getSearch();
    this.clienteInfo ={'nombres':'','materno':''}
    this.pagos ={}

  }

  onSelectionChange(event: any) {
    this.id_search = event.value.id;
    this.getCliente(this.id_search); 
    this.getClienteCredito(this.id_search); 
    $('#showSearch').removeClass('disp-n');
  }

  getSearch() {
    var data = new Array();
    this._searchservice.getSearch().subscribe(
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
      response => {
        if (response) {
          
          this.clienteInfo = response[0];
          setTimeout(() => {
            $("#showSearch").removeClass('disp_n');
          }, 300);
          this.cdr.detectChanges();
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
  getClienteCredito(cliente: number) {
    this._searchservice.getClienteCreditoSearch(cliente).subscribe(
      response => {
        if (response != 'No existen') {

          this.datos_credito = response;

          let total=0;
          this.datos_credito.forEach(function(a:any){total += parseFloat(a.deposito);});
          this.pagos_sum = total;

        }else{
          this.pagos_sum = 0;
          this.datos_credito = [{
            no_pago: 'No', cuota: 'Disponible', fecha: '', fecha_pago: null, pagado: ''
          }]
        }
        this.cdr.detectChanges();
      },
      error => {
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
}
