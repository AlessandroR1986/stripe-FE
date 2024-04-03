import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentCheckoutComponent } from './payment-checkout/payment-checkout.component';
import { SuccessPageComponent } from './success-page/success-page.component';

const routes: Routes = [
{
  path:'', component:PaymentCheckoutComponent
},
{
  path:'success', component: SuccessPageComponent
}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
