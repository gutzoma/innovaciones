import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../_services/home.service';
import { CommonModule } from '@angular/common';
import { TokenInterceptor } from '../../_helpers/token.interceptor';

declare let $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: ``,
  providers: [HomeService,TokenInterceptor]
})

export class HomeComponent implements OnInit {
  content?: string;

  constructor(
    private _homeservice: HomeService,
    private _tokenInterceptor: TokenInterceptor
  
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
    this._homeservice.getCartera(this._tokenInterceptor.authenticationService.getToken()).subscribe(
      response => {
        if (response != 'No existen') {

          $('.n-clientes').html(response[0].no_clientes);
          $('.n-prestamos').html(response[0].no_prestamos);
          $('.total-cartera').html(formatter.format(response[0].saldo_cartera));

        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
