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
  const groupedRequests = this.groupPickupRequests(
    this.filteredRequests
  );

  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;

  return groupedRequests.slice(start, end);
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



/*assignVendor(item: PickupRequest): void {

  debugger;
  const form = this.getRequestForm(item.pickupRequestId);
  const selectedVendor = form.get('selectedVendor')?.value;

  if (!selectedVendor?.vendor_Id) {
    alert('Please select a vendor.');
    return;
  }


  

  const currentWasteType = Number(item.wasteTypeId);
  const currentPincode = String(item.pincode ?? '').trim();

  const currentIndex = this.filteredRequests.findIndex(
    request =>
      request.pickupRequestId === item.pickupRequestId
  );

  if (currentIndex === -1) {
    alert('Pickup request not found.');
    return;
  }

  // Find the beginning of this consecutive group
  let start = currentIndex;

  while (start > 0) {
    const previous = this.filteredRequests[start - 1];

    if (
      Number(previous.wasteTypeId) !== currentWasteType ||
      String(previous.pincode ?? '').trim() !== currentPincode
    ) {
      break;
    }

    start--;
  }

  // Find the end of this consecutive group
  let end = currentIndex;

  while (end < this.filteredRequests.length - 1) {
    const next = this.filteredRequests[end + 1];

    if (
      Number(next.wasteTypeId) !== currentWasteType ||
      String(next.pincode ?? '').trim() !== currentPincode
    ) {
      break;
    }

    end++;
  }

  // Collect every request in this group
  const requests = this.filteredRequests
    .slice(start, end + 1)
    .map(request => ({
      vendor_Id: String(selectedVendor.vendor_Id),
      request_Id: String(request.pickupRequestId),
      pickupDateTime: String(request.pickupDateTime),
      WasteType_Id: Number(request.wasteTypeId)
    }));

  console.log('Requests being assigned:', requests);

  this.pickupRequestService.assignVendor(requests).subscribe({
    next: response => {
      console.log('Assign Response:', response);
      alert('Vendor assignment completed. Check the response for details.');
    },
    error: error => {
      console.error('Assign Error:', error);
      alert('Failed to assign vendor.');
    }
  });
}*/

assignVendor(item: PickupRequest): void {

  const form = this.getRequestForm(item.pickupRequestId);
  const selectedVendor = form.get('selectedVendor')?.value;

  if (!selectedVendor?.vendor_Id) {
    alert('Please select a vendor.');
    return;
  }

  // Use the same sorted and grouped list displayed in the table.
  const displayedRequests = this.groupPickupRequests(
    this.filteredRequests
  );

  // Find the selected request.
  const currentIndex = displayedRequests.findIndex(
    request =>
      Number(request.pickupRequestId) ===
      Number(item.pickupRequestId)
  );

  if (currentIndex === -1) {
    alert('Pickup request not found.');
    return;
  }

  // Use your existing grouping rule without changing it.
  let start = currentIndex;

  while (
    start > 0 &&
    this.isSameGroup(
      displayedRequests[start - 1],
      displayedRequests[currentIndex]
    )
  ) {
    start--;
  }

  let end = currentIndex;

  while (
    end < displayedRequests.length - 1 &&
    this.isSameGroup(
      displayedRequests[end + 1],
      displayedRequests[currentIndex]
    )
  ) {
    end++;
  }

  // Collect all requests belonging to this group.
  const requests: AssignVendorRequest[] =
    displayedRequests.slice(start, end + 1).map(request => {

      const requestForm = this.getRequestForm(
        request.pickupRequestId
      );

      return {
        vendor_Id: String(selectedVendor.vendor_Id),

        request_Id: String(request.pickupRequestId),

        pickupDateTime: String(
          requestForm.get('pickupDateTime')?.value ?? ''
        ),

        WasteType_Id: Number(request.wasteTypeId)
      };
    });

  console.log('Grouped requests:', requests);

  this.pickupRequestService.assignVendor(requests).subscribe({
    next: response => {
      console.log('Assign response:', response);

      alert(
        `Vendor assignment completed for ${requests.length} request(s).`
      );
    },

    error: error => {
      console.error('Assign error:', error);
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




private isSameVendorGroup(
  first: PickupRequest,
  second: PickupRequest
): boolean {
  return (
    this.normalizeStatus(first.status) ===
      this.normalizeStatus(second.status) &&
    this.normalizeGroupValue(first.society_Id) ===
      this.normalizeGroupValue(second.society_Id) &&
    this.normalizeGroupValue(first.pincode) ===
      this.normalizeGroupValue(second.pincode)
  );
}

/*showVendorDropdown(item: PickupRequest): boolean {
  const requests = this.filteredRequests;

  const currentIndex = requests.findIndex(
    request =>
      request.pickupRequestId === item.pickupRequestId
  );

  if (currentIndex === -1) {
    return false;
  }

  // Find the start of this consecutive group.
  let start = currentIndex;

  while (start > 0) {
    if (
      !this.isSameVendorGroup(
        requests[start - 1],
        requests[currentIndex]
      )
    ) {
      break;
    }

    start--;
  }

  // Find the end of this consecutive group.
  let end = currentIndex;

  while (end < requests.length - 1) {
    if (
      !this.isSameVendorGroup(
        requests[end + 1],
        requests[currentIndex]
      )
    ) {
      break;
    }

    end++;
  }

  // Show one dropdown in the middle of the group.
  const middleIndex = Math.floor((start + end) / 2);

  return currentIndex === middleIndex;
}*/


private getGroupKey(item: PickupRequest): string {
  return [
    (item.status || 'Pending').trim().toLowerCase(),
    String(item.society_Id ?? '').trim(),
    String(item.wasteTypeId ?? '').trim(),
    String(item.pincode ?? '').trim()
  ].join('|');
}

showVendorDropdown(item: PickupRequest): boolean {
  const index = this.paginatedRequests.indexOf(item);

  if (index === -1) {
    return false;
  }

  if (index === 0) {
    return true;
  }

  return !this.isSameGroup(
    this.paginatedRequests[index - 1],
    item
  );
}


isSameGroupAsPrevious(item: PickupRequest): boolean {
  const index = this.filteredRequests.findIndex(
    x => x.pickupRequestId === item.pickupRequestId
  );

  if (index <= 0) {
    return false;
  }

  const previous = this.filteredRequests[index - 1];

  return (
    (item.status || 'Pending').trim().toLowerCase() ===
      (previous.status || 'Pending').trim().toLowerCase() &&
    String(item.society_Id ?? '') === String(previous.society_Id ?? '') &&
    String(item.wasteTypeId ?? '') === String(previous.wasteTypeId ?? '') &&
    String(item.pincode ?? '') === String(previous.pincode ?? '')
  );
}


private normalizeGroupValue(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

private normalizeStatus(status: unknown): string {
  const value = this.normalizeGroupValue(status);

  return value === '' || value === 'null'
    ? 'pending'
    : value;
}

isSameGroup(
  previous: PickupRequest,
  current: PickupRequest
): boolean {
  return (
    this.normalizeStatus(previous.status) ===
      this.normalizeStatus(current.status) &&

    this.normalizeGroupValue(previous.society_Id) ===
      this.normalizeGroupValue(current.society_Id) &&

    this.normalizeGroupValue(previous.wasteTypeId) ===
      this.normalizeGroupValue(current.wasteTypeId) &&

    this.normalizeGroupValue(previous.pincode) ===
      this.normalizeGroupValue(current.pincode)
  );
}


getPickupGroupKey(item: PickupRequest): string {
  const status = (item.status ?? '').trim().toLowerCase();

  return [
    !status || status === 'null' ? 'pending' : status,
    String(item.society_Id ?? '').trim(),
    String(item.wasteTypeId ?? '').trim(),
    String(item.pincode ?? '').trim()
  ].join('|');
}

groupPickupRequests(requests: PickupRequest[]): PickupRequest[] {
  return [...requests].sort((a, b) =>
    this.getPickupGroupKey(a).localeCompare(
      this.getPickupGroupKey(b),
      undefined,
      { numeric: true }
    )
  );
}

onPickupDateTimeChange(
  item: PickupRequest,
  pickupDateTime: string
): void {

  // Update every request having the same grouping criteria.
  const groupRequests = this.filteredRequests.filter(request =>
    this.isSameGroup(item, request)
  );

  for (const request of groupRequests) {

    const requestForm = this.getRequestForm(
      request.pickupRequestId
    );

    requestForm.patchValue(
      {
        pickupDateTime: pickupDateTime
      },
      { emitEvent: false }
    );
  }

  console.log(
    'Pickup date applied to group:',
    groupRequests.map(request => ({
      pickupRequestId: request.pickupRequestId,
      pickupDateTime: pickupDateTime
    }))
  );
}





}
 



  




