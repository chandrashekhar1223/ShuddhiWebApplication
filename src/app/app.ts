import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './Shared/Sidebar/sidebar/sidebar';
import { GetUsers } from './Users/getusers/get-users';
import { Getvendors } from './Users/vendor/getvendors/getvendors';
import { CO2 } from './CO2_saved/co2/co2';

import {GetPickupRequest} from './Vendor/get-pickup-request/get-pickup-request'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Sidebar,GetUsers,Getvendors,CO2],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Shuddhi');
}
