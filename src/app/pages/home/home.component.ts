import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../_services/home.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";

declare let $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './home.component.html',
  styles: ``,
  providers: [HomeService]
})

export class HomeComponent implements OnInit {
  constructor(
    private _homeservice: HomeService
  ) { }

  ngOnInit(): void {
    this.getCartera();
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
}
