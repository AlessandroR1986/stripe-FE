import { Component, ViewChild, inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { StripeAddressComponent, StripePaymentElementComponent, injectStripe,  StripeElementsDirective } from 'ngx-stripe';
import { CheckoutService } from '../services/checkout.service';
import { StripeAddressElementOptions, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { environment } from '../environments/environment';
import { PaymentInfo } from '../model/payment-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.css'
})
export class PaymentCheckoutComponent {

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  @ViewChild(StripeAddressComponent) 
  shippingAddress!: StripeAddressComponent;


  private readonly fb = inject(UntypedFormBuilder);
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

  paymentInfo : PaymentInfo = new PaymentInfo();

  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'it',
    appearance: {
      theme: 'night',
      labels: 'floating'
    },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'accordion',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: true
    }
  };
  
  shippingAddressOptions: StripeAddressElementOptions = {
    mode: 'shipping',
    fields: {
      phone: 'always'
    },
    validation: {
      phone: {
        required: 'never',
      },
    }
  };

  billingAddressOptions: StripeAddressElementOptions = {
    mode: 'billing'
  };

  stripe = injectStripe(environment.stripe.publicKey);

  ngOnInit(){
    this.paymentInfo.amount = 19660;
    this.paymentInfo.currency = 'EUR';
    this.paymentInfo.receiptEmail = 'promazzo@gmail.com'
    this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe((pi) => {
      this.elementsOptions.clientSecret = pi.client_secret as string;
    })
  }


  pay() {
   // if (this.paymentElementForm.invalid) return;
   
    console.log('pagato')
   // const { name, email, address, zipcode, city } = this.checkoutForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          return_url: 'http://localhost:4200/success'
          // payment_method_data: {
          //   billing_details: {
          //     name:'Marco prova',
          //     email: 'maprov@jejo.it',
          //     address: {
          //       line1: 'via Milano 17',
          //       postal_code:'885566',
          //       city: 'Firenze'
          //     }
          //   }
          // }
        },
        
        redirect: 'if_required'
      })
      .subscribe(result => {
        //this.paying.set(false);
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert('Pagamento avvenuto con successo');
          }
        }
      });
  }

  async getAddressValue() {
    const result = await this.shippingAddress.getValue();
    const { complete, isNewAddress, value } = result;
    console.log('result address', result)
    // if complete is true, you can allow the user to the next step
    // Optionally: you can use value to store address details
  }

}
