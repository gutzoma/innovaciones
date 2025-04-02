import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { MenuComponent } from "../menu/menu.component";
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalTablaComponent } from '../modal-tabla/modal-tabla.component';
import { HistoryCliente } from '../../_models/history_cliente';

declare var $: any;

@Component({
  selector: 'app-credit-history',
  imports: [MenuComponent, CommonModule],
  standalone: true,
  templateUrl: './credit-history.component.html',
  styles: ``,
  providers: [ProfileService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreditHistoryComponent {

  public clienteInfo: HistoryCliente;
  public prestamosInfo!: any;

  constructor(private _router:ActivatedRoute, private cdr: ChangeDetectorRef, private _profileservice: ProfileService, public dialog: MatDialog) {
this.clienteInfo = new HistoryCliente('','','','',''
  ,'','','','','','','','','','','','',''
  ,'','','','','','','');
   }

   ngOnInit (){
    this._router.params.subscribe(params => {
      this.getCreditHistory(params['id']);
      this.getCreditHistory2(params['id']);
    });
  }
  getCreditHistory(params: any) {
    this._profileservice.getCreditHistory (params).subscribe(
      response => {
        if(response != 'No existen'){
          this.clienteInfo = response[0];
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getCreditHistory2(params: any) {
    this._profileservice.getCreditHistory2 (params).subscribe(
      response => {
        if(response != 'No existen'){
          this.prestamosInfo = response;
          this.cdr.detectChanges();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  modalHistory(id: number): void {
    this.dialog.open(ModalTablaComponent, {
      width: '500px',
      data: { prestamo_id: id },
    });
  }
}
