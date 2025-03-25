import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthenticationService } from '../../_services/authentication.service';
import { Login } from '../../_models/login';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';

declare let $: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public login: Login;
  public loginForm!: FormGroup;
  isLogin: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
    this.login = new Login('','');
   }

   ngOnInit() {
    this.isUserLogin();
  }

  public onSubmit() {
    this.authenticationService.login(this.login);
  }

  isUserLogin(){
    if(this.authenticationService.isLoggedIn()){
        this.isLogin = true;
    }

  }
}
