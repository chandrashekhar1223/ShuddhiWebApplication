import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Society {
   Id?: number | null;
  Society_Name: string;
  Pincode: string;
  Landmark?: string;
  Sector?: string;
  Plot_No?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocietyService {

  private apiUrl = 'https://smart-force.in/Shuddhi/Society';

  constructor(private http: HttpClient) {}

  addSociety(society: Society): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/AddSociety`,
      society
    );
  }

   // UPDATE
  updateSociety(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/UpdateSocieties`,
      data
    );
  }
}