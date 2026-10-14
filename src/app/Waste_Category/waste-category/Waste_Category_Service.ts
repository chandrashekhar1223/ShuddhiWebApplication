import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../Environments/environmentlocal'

export interface SubWasteType {
  wasteSubTypeId: number;
  wasteSubType: string;
}

export interface WasteType {
  wasteTypeId: number;
  wasteType: string;
  subWasteTypes: SubWasteType[];
}

export interface WasteTypeResponse {
  outputStatus: string;
  wasteTypes: WasteType[];
}

@Injectable({
  providedIn: 'root'
})
export class WasteTypeService {

  //private apiUrl = 'https://localhost:7227/api/Waste/GetWasteMaster';

   private apiUrl = `${environment.apiUrl}/Waste/GetWasteMaster`;

  constructor(private http: HttpClient) {}

  getWasteTypes(): Observable<WasteTypeResponse> {
    return this.http.get<WasteTypeResponse>(this.apiUrl);
  }
}