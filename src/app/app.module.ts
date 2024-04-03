import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from './environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatInputModule} from '@angular/material/input';
import { PaymentCheckoutComponent } from './payment-checkout/payment-checkout.component';
import { SuccessPageComponent } from './success-page/success-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentCheckoutComponent,
    SuccessPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
