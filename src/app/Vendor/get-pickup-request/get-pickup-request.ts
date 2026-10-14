import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PickupRequest } from './get-pickup-request-model';
import { PickupRequestService } from './Service';
import { VendorService } from './LoadVendorService';
import { Vendor } from './Vendor';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
    FormControl,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
interface AssignVendorRequest {
  vendor_Id: string;
  request_Id: string;
   pickupDateTime: string;
   WasteType_Id:number;
}
@Component({
  selector: 'app-get-pickup-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,ReactiveFormsModule
  ],
  templateUrl: './get-pickup-request.html',
  styleUrls: ['./get-pickup-request.css']
})

export class GetPickupRequest implements OnInit {


searchForm!: FormGroup;

searchControl = new FormControl('');

filteredRequests: any[] = [];




   
  pendingRequests: PickupRequest[] = [];
  vendors: Vendor[] = [];

    // =====================================================
  // REACTIVE FORMS
  // =====================================================

  requestForms: Map<number, FormGroup> = new Map();


    // =====================================================
  // PAGINATION
  // =====================================================

  currentPage: number = 1;

  pageSize: number = 10;

  constructor(
    private pickupRequestService: PickupRequestService,
    private VendorService:VendorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {


     this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => {

      this.applySearch(value || '');

    });


   this.loadPendingRequests();

    







 
    
  }


  loadPendingRequests(): void {

    this.pickupRequestService.getPendingPickupRequests().subscribe({
      next: (response) => {

        this.pendingRequests = response;

  
  this.filteredRequests = [
      ...this.pendingRequests
    ];

    this.currentPage = 1;

    this.createRequestForms();


this.createRequestForms();


        
        console.log('Pickup Requests:', this.pendingRequests);
      },

      error: (error) => {
        console.error(
          'Error loading pickup requests:',
          error
        );
      }
    });

  }

   // =====================================================
  // CREATE FORM FOR EACH REQUEST
  // =====================================================

  createRequestForms(): void {

    this.requestForms.clear();


    for (const item of this.pendingRequests) {

      const form = this.fb.group({

        selectedVendor: [
          item.selectedVendor || ''
        ],

        pickupDateTime: [
          item.pickupDateTime || ''
        ]

      });


      this.requestForms.set(
        item.pickupRequestId,
        form
      );

    }

  }

   // =====================================================
  // GET FORM FOR REQUEST
  // =====================================================

  getRequestForm(
    pickupRequestId: number
  ): FormGroup {

    let form =
      this.requestForms.get(pickupRequestId);


    if (!form) {

      form = this.fb.group({

        selectedVendor: [''],

        pickupDateTime: ['']

      });


      this.requestForms.set(
        pickupRequestId,
        form
      );

    }


    return form;

  }


   // =====================================================
  // PAGINATED REQUESTS
  // =====================================================
get paginatedRequests(): any[] {

  const start =
    (this.currentPage - 1) * this.pageSize;

  const end =
    start + this.pageSize;

  return this.filteredRequests.slice(
    start,
    end
  );
}


  // =====================================================
  // TOTAL PAGES
  // =====================================================

get totalPages(): number {

  return Math.ceil(
    this.filteredRequests.length / this.pageSize
  );

}


  // =====================================================
  // PAGE NUMBERS
  // =====================================================
get pages(): number[] {

  return Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

}


  // =====================================================
  // START ITEM
  // =====================================================
get startItem(): number {

  if (
    this.filteredRequests.length === 0
  ) {

    return 0;

  }


  return (
    (this.currentPage - 1) *
    this.pageSize
  ) + 1;

}


  // =====================================================
  // END ITEM
  // =====================================================

  get endItem(): number {

    return Math.min(

      this.currentPage *
      this.pageSize,

      this.pendingRequests.length

    );

  }


  // =====================================================
  // GO TO PAGE
  // =====================================================

  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // =====================================================
  // CHANGE PAGE SIZE
  // =====================================================

  changePageSize(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    this.pageSize =
      Number(select.value);


    this.currentPage = 1;

  }



  loadVendors(pinCode: string,wasteTypeId:number): void {

  console.log('Pincode:', pinCode);

  if (!pinCode) {
    this.vendors = [];
    return;
  }

  this.VendorService.getVendorsByPincode(pinCode,wasteTypeId).subscribe({
    next: (response: Vendor[]) => {
      console.log('Vendors:', response);
      this.vendors = response;
    },
    error: (error: any) => {
      console.error('Error loading vendors:', error);
      this.vendors = [];
    }
  });
}


assignVendor(item: PickupRequest): void {
debugger;
 // if (!item.selectedVendor?.Vendor_Id) {
 //   alert('Please select a vendor.');
 //   return;
//  }

console.log('Selected Vendor:', item.selectedVendor);
console.log('Selected Vendor JSON:', JSON.stringify(item.selectedVendor));

  if (item.selectedVendor === null || item.selectedVendor === undefined) {
    alert('Please select a vendor.');
    return;
  }

  //const selectedVendor = item.selectedVendor?.vendor_Id;
  

  const request: AssignVendorRequest = {
   vendor_Id: String(item.selectedVendor.vendor_Id),
    request_Id: String(item.pickupRequestId),
   pickupDateTime: String(item.pickupDateTime),
   WasteType_Id:Number(item.wasteTypeId)
};

  console.log('Assign Request:', request);

  this.pickupRequestService.assignVendor(request).subscribe({
    next: (response) => {
      console.log('Assign Response:', response);
      alert(response);
    },
    error: (error) => {
      console.error('Assign Error:', error);
      alert('Failed to assign vendor.');
    }
  });
}



applySearch(searchText: string): void {

  const search = searchText
    .toString()
    .trim()
    .toLowerCase();

  if (!search) {

    this.filteredRequests = [
      ...this.pendingRequests
    ];

    this.currentPage = 1;

    return;
  }

  this.filteredRequests = this.pendingRequests.filter(item => {

    const allData = [

      item.pickupRequestId,
      item.name,
      item.photoPath,
      item.quantity,
      item.status,
      item.address,
      item.society,
      item.wasteTypeId,
      item.sub_Waste_Type,
      item.note,
      item.latitude,
      item.longitude,
      item.totalEstimatedWaste,
      item.createdDate,
      item.pincode,
      item.pickupDateTime

    ];

    return allData.some(value => {

      if (
        value === null ||
        value === undefined
      ) {
        return false;
      }

      return String(value)
        .toLowerCase()
        .includes(search);

    });

  });

  this.currentPage = 1;
}


matchSearch(
  value: any,
  searchValue: any
): boolean {

  if (
    searchValue === null ||
    searchValue === undefined ||
    searchValue === ''
  ) {

    return true;

  }


  if (
    value === null ||
    value === undefined
  ) {

    return false;

  }


  return String(value)
    .toLowerCase()
    .includes(
      String(searchValue).toLowerCase()
    );

}


clearSearch(): void {

  this.searchControl.setValue('');

  this.filteredRequests = [...this.pendingRequests];

  this.currentPage = 1;
}


highlightParts(value: any): { text: string; match: boolean }[] {
  if (value === null || value === undefined) {
    return [];
  }

  const text = String(value);
  const search = (this.searchControl.value || '').trim();

  if (!search) {
    return [{ text, match: false }];
  }

  const parts: { text: string; match: boolean }[] = [];
  const regex = new RegExp(
    `(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {

    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        match: false
      });
    }

    parts.push({
      text: match[0],
      match: true
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      match: false
    });
  }

  return parts.length
    ? parts
    : [{ text, match: false }];
}



showVendorDropdown(item: any, index: number): boolean {
  const currentWasteType = Number(item.wasteTypeId);
  const currentPincode = String(item.pincode ?? '').trim();

  const isSameGroup = (request: any) =>
    Number(request.wasteTypeId) === currentWasteType &&
    String(request.pincode ?? '').trim() === currentPincode;

  // Find the beginning of the consecutive group
  let start = index;
  while (
    start > 0 &&
    isSameGroup(this.filteredRequests[start - 1])
  ) {
    start--;
  }

  // Find the end of the consecutive group
  let end = index;
  while (
    end < this.filteredRequests.length - 1 &&
    isSameGroup(this.filteredRequests[end + 1])
  ) {
    end++;
  }

  // Display only on the middle row
  const middleIndex = Math.floor((start + end) / 2);

  return index === middleIndex;
}

getVendorDropdownGroupStart(item: any, index: number): number {
  const sameGroup = (request: any) =>
    Number(request.wasteTypeId) === Number(item.wasteTypeId) &&
    String(request.pincode ?? '').trim() ===
      String(item.pincode ?? '').trim();

  let start = index;

  while (
    start > 0 &&
    sameGroup(this.filteredRequests[start - 1])
  ) {
    start--;
  }

  return start;
}



}
 



  




