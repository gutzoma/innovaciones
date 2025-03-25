import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../_services/home.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../_services/profile.service';

declare let $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: ``,
  providers: [HomeService, ProfileService]
})

export class HomeComponent implements OnInit {
  content?: string;
  public asesor!: any;
  constructor(
    private _homeservice: HomeService,
    private _profileservice: ProfileService,
  ) { }

  ngOnInit(): void {

    this.getCartera();
    this.asesor = JSON.parse(localStorage.getItem('userData')!);
    this.getCarteraProfile(this.asesor.cartera);
  }

  getCartera() {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    })
    this._homeservice.getCartera().subscribe(
      response => {
        if (response != 'No existen') {

          $('.n-clientes').html(response[0].no_clientes);
          $('.n-prestamos').html(response[0].no_prestamos);
          $('.total-cartera').html(formatter.format(response[0].saldo_cartera));

        }
      },
      error => {
        if(error.status === 401){
          localStorage.clear();
          window.location.href = '';
        }
      }
    );
  }
  getCarteraProfile(id:any) {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    })
    this._profileservice.getCarteraProfile(id).subscribe(
      response => {
        if (response != 'No existen') {
          $('.n-prestamos-profile').html(response[0].no_prestamos);
          $('.total-cartera-profile').html(formatter.format(response[0].saldo_cartera));
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
