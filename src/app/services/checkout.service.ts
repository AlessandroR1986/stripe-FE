import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { PaymentInfo } from '../model/payment-info';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  
  paymentUrl = environment.apiUrl + '/api/payment-intent';

  constructor(private httpClient : HttpClient) { }


  createPaymentIntent(paymentInfo : PaymentInfo) : Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.paymentUrl, paymentInfo)
  }
}
