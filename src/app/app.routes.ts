import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AddclientComponent } from './pages/addclient/addclient.component';
import { EditclientComponent } from './pages/editclient/editclient.component';
import { AddcreditComponent } from './pages/addcredit/addcredit.component';
import { EditcreditComponent } from './pages/editcredit/editcredit.component';
import { AddpaymentComponent } from './pages/addpayment/addpayment.component';
import { ApproveComponent } from './pages/approve/approve.component';
import { DisperseComponent } from './pages/disperse/disperse.component';
import { CashboxComponent } from './pages/cashbox/cashbox.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'addclient',
    component: AddclientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editclient',
    component: EditclientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addcredit',
    component: AddcreditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editcredit',
    component: EditcreditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addpayment',
    component: AddpaymentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'approve', component: ApproveComponent, canActivate: [AuthGuard] },
  { path: 'disperse', component: DisperseComponent, canActivate: [AuthGuard] },
  { path: 'cashbox', component: CashboxComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
