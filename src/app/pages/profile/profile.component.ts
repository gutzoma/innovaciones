import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralesService } from '../../_services/generales.service';
import { ProfileService } from '../../_services/profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

declare let $: any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styles: ``,
  providers: [GeneralesService, ProfileService],
})
export class ProfileComponent {
  currentUser: any;
  public asesor!: any;
  datos_agenda: any[] = [];
  public datos_agenda_cliente!: any;
  cargando: boolean = true;

  constructor(
    private _profileservice: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.getCarteraProfile(this.asesor.cartera);
    this.getCarteraAgenda(this.asesor.cartera);
    this.getCarteraClientes(this.asesor.cartera);
  }

  getCarteraProfile(id: any) {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });
    this._profileservice.getCarteraProfile(id).subscribe(
      (response) => {
        if (response != 'No existen') {
          $('.n-prestamos').html(response[0].no_prestamos);
          $('.total-cartera').html(formatter.format(response[0].saldo_cartera));
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

  getCarteraAgenda(cliente: number) {
    this._profileservice.getCarteraAgenda(cliente).subscribe(
      (response) => {
        if (response != 'No existen') {
          this.datos_agenda = response;
          this.cdr.detectChanges();
        } else {
          this.datos_agenda = [
            {
              cliente_id: 'HAY',
              cuota: '',
              fecha: '',
              materno: '',
              no_pago: '',
              nombres: 'PAGOS PENDIENTES',
              paterno: '',
              prestamo_id: 'NO',
              atraso: '359',
            },
          ];
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
  getCarteraClientes(cliente: number) {
    this._profileservice.getCarteraClientes(cliente).subscribe(
      (response) => {
        if (response != 'No existen') {
          this.datos_agenda_cliente = response;
          this.cdr.detectChanges();
        } else {
          this.datos_agenda_cliente = [
            {
              cliente_id: 'HAY',
              cuota: '',
              fecha: '',
              materno: '',
              no_pago: '',
              nombres: '',
              paterno: '',
              prestamo_id: 'NO',
            },
          ];
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
}
