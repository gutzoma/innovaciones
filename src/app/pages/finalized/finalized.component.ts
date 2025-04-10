import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { Liquidaciones } from '../../_models/liquidaciones';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';

declare let $: any;

@Component({
  selector: 'app-finalized',
  standalone: true,
  imports: [FormsModule, CommonModule, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './finalized.component.html',
  styles: ``,
  providers: [GeneralesService],
})
export class FinalizedComponent {
  public liquidaciones: Liquidaciones;
  public asesor!: any;

  constructor(
    private _generalesservice: GeneralesService,
    public dialog: MatDialog
  ) {
    this.liquidaciones = new Liquidaciones('', '', '');
  }

  ngOnInit(): void {}

  runLiquidacin(form: { reset: () => void }) {
    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.asesor = this.asesor.id;
    this.liquidaciones.asesor = this.asesor;
    this._generalesservice.runLiquidacion(this.liquidaciones).subscribe(
      (response) => {
        if (response[0].Error != '') {
          this.modalInfo(response[0].Error, 'error');
        } else {
          this.modalInfo('Credito Liquidado', 'success');
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
        this.modalInfo('Valida que tu informacion sea correcta', 'error');
      }
    );
  }
  modalInfo(info: any, tipo: any): void {
    this.dialog.open(ModalInfoComponent, {
      width: '500px',
      data: { info: info, tipo: tipo },
    });
  }
}
