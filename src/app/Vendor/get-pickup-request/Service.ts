import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PickupRequest } from './get-pickup-request-model';
import { environment } from '../../../Environments/environmentlocal';


@Injectable({
  providedIn: 'root'
})
export class PickupRequestService {

  //private apiUrl = 'https://localhost:7227/api/TokenManager/GetRequests';

  private apiUrl = `${environment.apiUrl}/TokenManager/GetRequests`;

  constructor(private http: HttpClient) { }


 getPendingPickupRequests(): Observable<PickupRequest[]> {

  try {

    debugger;

    return this.http.get<PickupRequest[]>(this.apiUrl).pipe(
      tap(response => {
        

         
        debugger;
      })
    );

  } catch (ex) {

    console.error('Unexpected Error:', ex);
    debugger;

    throw ex;
  }
}

//private Assignvendor:any='https://localhost:7227/api/TokenManager/Assign_Vendor';

private Assignvendor = `${environment.apiUrl}/TokenManager/Assign_Vendor`;

assignVendor(data: any): Observable<string> {
  debugger;
  return this.http.post(
    this.Assignvendor,
    data,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text'
    }
  ).pipe(
    tap((response: string) => {
      console.log('API Response:', response);
    })
  );
}


}