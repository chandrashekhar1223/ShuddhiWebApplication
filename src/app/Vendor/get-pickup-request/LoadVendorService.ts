import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {environment} from '../../../Environments/environmentlocal'


export interface Vendor {
  vendorName: string;
  recycleMainID: number;
  wasteType: string;
  vendor_Id:number;

}

@Injectable({
  providedIn: 'root'
})
export class VendorService {

 // private apiUrl = 'https://localhost:7227/api/TokenManager/GetVendor';

   private apiUrl = `${environment.apiUrl}/TokenManager/GetVendor`;

  constructor(private http: HttpClient) {}
getVendorsByPincode(pincode: string,wasteTypeId: number): Observable<Vendor[]> {
debugger;

const requestBody = {
    pincode: pincode,
    wasteTypeId: wasteTypeId
  };
  console.log('Pincode being sent:', pincode);

  return this.http.post<Vendor[]>(
    this.apiUrl,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).pipe(
    tap((response: Vendor[]) => {
      console.log('API Response:', response);
    }),
    catchError((error) => {
      console.error('API Error:', error);
      console.error('Status:', error.status);
      console.error('Error body:', error.error);

      return throwError(() => error);
    })
  );
}
}