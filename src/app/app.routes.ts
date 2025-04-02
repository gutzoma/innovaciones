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
import { ReportCreditsComponent } from './pages/report-credits/report-credits.component';
import { ReportPaidComponent } from './pages/report-paid/report-paid.component';
import { FinalizedComponent } from './pages/finalized/finalized.component';
import { SearchComponent } from './pages/search/search.component';
import { ReportPaymentsComponent } from './pages/report-payments/report-payments.component';
import { ReportPaymentsContaComponent } from './pages/report-payments-conta/report-payments-conta.component';
import { ReportCashboxComponent } from './pages/report-cashbox/report-cashbox.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreditHistoryComponent } from './pages/credit-history/credit-history.component';

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
  { path: 'report_credits', component: ReportCreditsComponent,canActivate: [AuthGuard] },
  { path: 'report_paid', component: ReportPaidComponent,canActivate: [AuthGuard] },
  { path: 'finalized', component: FinalizedComponent,canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent,canActivate: [AuthGuard] },
  { path: 'report_payments', component: ReportPaymentsComponent,canActivate: [AuthGuard] },
  { path: 'report_payments_conta', component: ReportPaymentsContaComponent,canActivate: [AuthGuard] },
  { path: 'report_cashbox', component: ReportCashboxComponent,canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard] },
  { path: 'credit_history/:id', component: CreditHistoryComponent,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
