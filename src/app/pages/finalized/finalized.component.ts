import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { Liquidaciones } from "../../_models/liquidaciones";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare let $: any;

@Component({
  selector: 'app-finalized',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './finalized.component.html',
  styles: ``,
  providers: [
    GeneralesService
  ],
})
export class FinalizedComponent {
  public liquidaciones: Liquidaciones;
  public asesor!: any;

  constructor(private _generalesservice: GeneralesService) {
    this.liquidaciones = new Liquidaciones("", "", "");
  }

  ngOnInit(): void {}

  runLiquidacin(form: { reset: () => void }) {
    this.asesor = JSON.parse(localStorage.getItem("userData")!);
    this.asesor = this.asesor.id;
    this.liquidaciones.asesor = this.asesor;
    this._generalesservice.runLiquidacion(this.liquidaciones).subscribe(
      response => {
        if (response) {
          alert('Credito Liquidado');
          location.reload();
        }
      },
      error => {
        var errortype = error.error;
            if(error.status === 400 || (error.status === 401 && !errortype.includes('SQLSTATE'))){
              localStorage.clear();
              window.location.href = '';
            }
      }
    );
  }
}
