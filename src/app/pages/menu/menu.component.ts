import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

declare let $: any;
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  public profile:any;

  constructor(private cdr: ChangeDetectorRef) {
  
     }
  ngOnInit(){
    const user = JSON.parse(localStorage.getItem('userData')!);
    let name = user.nombres + ' ' + user.paterno + ' ' + user.materno;
    $('.name').html(name);
    this.profile = user.rol;

    this.cdr.detectChanges();
    $('.navigation').find('li').has('ul').addClass('has-sub');

    $(".logout").on("click", () => {
      localStorage.clear();
      window.location.href = '';
      });
  }
}
