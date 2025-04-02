import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { MenuComponent } from "../menu/menu.component";
import { CommonModule } from '@angular/common';

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

  public clienteInfo!: any;
  public prestamosInfo!: any;
  public creditoInfo!: any;

  constructor(private _router:ActivatedRoute, private cdr: ChangeDetectorRef, private _profileservice: ProfileService) {

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
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getCreditHistory3(params: any) {
    this._profileservice.getCreditHistory2 (params).subscribe(
      response => {
        if(response != 'No existen'){
          this.creditoInfo = response;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
