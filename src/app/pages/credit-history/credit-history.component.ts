import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { MenuComponent } from '../menu/menu.component';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditHistoryComponent {
  public clienteInfo: HistoryCliente;
  public prestamosInfo!: any;
  public info = false;
  public infoAval = false;
  public creditNull = false;

  constructor(
    private _router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _profileservice: ProfileService,
    public dialog: MatDialog
  ) {
    this.clienteInfo = new HistoryCliente(
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
  }

  ngOnInit() {
    this._router.params.subscribe((params) => {
      this.getCreditHistory(params['id']);
    });
  }
  getCreditHistory(params: any) {
    this._profileservice.getCreditHistory(params).subscribe(
      (response) => {
        if (response != 'No existen') {
          this.clienteInfo = response[0];
          this.getCreditHistory2(this.clienteInfo.cliente_id);
        } else {
          this.getCreditHistory4(params);
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
  }
  getCreditHistory2(params: any) {
    this._profileservice.getCreditHistory2(params).subscribe(
      (response) => {
        if (response != 'No existen') {
          this.prestamosInfo = response;
          this.info = true;
          this.cdr.detectChanges();
        }else{
          this.info = true;
          this.creditNull = true;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
  getCreditHistory4(params: any) {
    this._profileservice.getCreditHistory4(params).subscribe(
      (response) => {
        if (response != 'No existen') {
          this.clienteInfo = response[0];
          this.getCreditHistory2(this.clienteInfo.cliente_id);
          this.info = true;
          this.infoAval = true;
          this.cdr.detectChanges();
        }
      },
      (error) => {
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
