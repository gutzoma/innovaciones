import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private cdr: ChangeDetectorRef, private router: Router) {

     }
  ngOnInit(){
    const user = JSON.parse(localStorage.getItem('userData')!);
    let name = user.nombres + ' ' + user.paterno + ' ' + user.materno;
    $('.name').html(name);
    this.profile = user.rol;
    setTimeout(() => {
      $('.navigation').find('li').has('ul').addClass('has-sub');
    }, 500);
    this.cdr.detectChanges();
    $('.search-client').on('keydown', (event: { key: string; }) => {
      if (event.key === 'Enter') {
         this.router.navigate(['credit_history/' + $('.search-client').val()]).then(() => {
          window.location.reload();
        });
      }
  });
    $(".logout").on("click", () => {
      localStorage.clear();
      window.location.href = '';
      });
  }
}
