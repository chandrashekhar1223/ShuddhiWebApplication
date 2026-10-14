import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Society {
  id?: number;
  society_Name?: string;
  pincode?: string;
  landmark?: string;
  sector?: string;
  plot_No?: string;
  staff_Name?:string;
  staff_Phone_Number:number;
  created_Date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocietyService {

  private apiUrl = 'https://smart-force.in/Shuddhi/api/Society';

  constructor(private http: HttpClient) {}

getSocieties(): Observable<Society[]> {

  return this.http.get<Society[]>(
    `${this.apiUrl}/GetSocietes`
  ).pipe(
    tap(response => {
      console.log('Society API Response:', response);
    })
  );
}

deleteSociety(id: number): Observable<any> {

  return this.http.delete<any>(
    `${this.apiUrl}/DeleteSociety/${id}`
  );
}


}