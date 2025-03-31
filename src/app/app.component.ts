import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'paayito_v3';
  ngOnInit(){
    $('.navigation').find('li').has('ul').addClass('has-sub');
  }
}
