import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentIntent, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import {StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit{
 
 @ViewChild(StripeCardNumberComponent) card! : StripeCardNumberComponent;
 
 
 public cardOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontWeight: 400,
      fontFamily: 'Circular',
      fontSize: '14px',
      iconColor: '#666EE8',
      color: '#002333',
      '::placeholder': {
        color: '#919191',
      },
    },
  },
};

public elementsOptions: StripeElementsOptions = {
  locale: 'en',
};


paymentForm: FormGroup = this.fb.group({
  name: ['John'],
  email: ['john@gmail.com'],
  amount: [100],
});

constructor(private http: HttpClient,
  private fb: FormBuilder,
  private stripeService: StripeService) {} 
 
ngOnInit(): void {
    
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${environment.apiUrl}/create-payment-intent`,
      { amount }
    );
    }

    pay(): void {
      if (this.paymentForm.valid) {
        this.createPaymentIntent(this.paymentForm.get('amount')!.value)
          .pipe(
            switchMap((pi:any) =>
              this.stripeService.confirmCardPayment(pi.client_secret, {
                payment_method: {
                  card: this.card.element,
                  billing_details: {
                    name: this.paymentForm.get('name')!.value,
                  },
                },
              })
            )
          )
          .subscribe((result) => {
            if (result.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.log(result.error.message);
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
              }
            }
          });
      } else {
        console.log(this.paymentForm);
      }
    }
}
