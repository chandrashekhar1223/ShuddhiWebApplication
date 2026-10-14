import { Routes } from '@angular/router';
import { GetPickupRequest } from './Vendor/get-pickup-request/get-pickup-request';
import {WasteCategory}from './Waste_Category/waste-category/waste-category';
import { Societies } from './Societies/societies';
import {Insertsociety} from './insertsociety/insertsociety';

export const routes: Routes = [
  {
    path: 'pickup-requests',
    component: GetPickupRequest
  },
  {
    path:'Waste_Category',
    component:WasteCategory
  },
  {
    path:'societies',
    component:Societies

  },
  {
    path:'add-society',
    component:Insertsociety

  },
  {
    
    path: 'insertsociety',
    component: Insertsociety
  

  }

];