import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Society, SocietyService } from './Society_Service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-societies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
     FormsModule,
    RouterLink
  ],
  templateUrl: './societies.html',
  styleUrl: './societies.css'
})
export class Societies implements OnInit {

  filteredSocieties: Society[] = [];
  isSearching: boolean = false;
// All societies from API
societies: Society[] = [];

// Societies displayed on current page
paginatedSocieties: Society[] = [];

// Pagination
currentPage: number = 1;
pageSize: number = 10;
totalPages: number = 0;

// Page numbers
pages: number[] = [];

// Used by template
Math = Math;




updatePagination(): void {

  // Decide which data to paginate
  const data = this.isSearching
    ? this.filteredSocieties
    : this.societies;

  // Calculate total pages
  this.totalPages = Math.ceil(
    data.length / this.pageSize
  );

  // Generate page numbers
  this.pages = Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

  // Make sure current page is valid
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages || 1;
  }

  const startIndex =
    (this.currentPage - 1) * this.pageSize;

  const endIndex =
    startIndex + this.pageSize;

  // Display current page records
  this.paginatedSocieties =
    data.slice(startIndex, endIndex);
}

goToPage(page: number): void {

  if (page < 1 || page > this.totalPages) {
    return;
  }

  this.currentPage = page;

  this.updatePagination();
}


previousPage(): void {

  if (this.currentPage > 1) {

    this.currentPage--;

    this.updatePagination();
  }
}


nextPage(): void {

  if (this.currentPage < this.totalPages) {

    this.currentPage++;

    this.updatePagination();
  }
}


changePageSize(): void {

  this.currentPage = 1;

  this.updatePagination();
}

 // societies: Society[] = [];

  loading = false;

  searchForm = new FormGroup({
    search: new FormControl<string>('')
  });

  constructor(private societyService: SocietyService,  private router: Router) {

  }

  ngOnInit(): void {

    // Load all societies when page opens
    this.loadSocieties();
      // Search whenever user types
  this.searchForm.get('search')?.valueChanges.subscribe(value => {
    this.searchSocieties(value || '');
  });
}

  loadSocieties(): void {

    this.loading = true;

    this.societyService.getSocieties()
      .subscribe({
        next: (response: Society[]) => {

          console.log('Societies:', response);

          this.societies = response;
             // Reset to first page
              // Reset search
        this.isSearching = false;
        this.filteredSocieties = [];
      this.currentPage = 1;

      // Apply pagination
      this.updatePagination();


          this.loading = false;
        },

        error: (error) => {

          console.error('Error loading societies:', error);

          this.societies = [];

          this.loading = false;
        }
      });
  }

  editSociety(society: any): void {

     console.log('Selected Society:', society);

  this.router.navigate(
    ['/insertsociety'],
    {
      state: {
        society: society
      }
    }
  );
}

deleteSociety(society: Society): void {

  if (!society.id) {
    console.error('Society ID not found.');
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${society.society_Name}"?`
  );

  if (!confirmed) {
    return;
  }

  console.log('Deleting Society ID:', society.id);

  this.societyService.deleteSociety(society.id).subscribe({
    next: (response) => {

      console.log('Delete response:', response);

      if (response.success === 1) {

        alert(response.message);

        // Reload society list
        this.loadSocieties();

      } else {

        alert(response.message || 'Unable to delete society.');

      }
    },

    error: (error) => {

      console.error('Delete error:', error);

      alert('Failed to delete society.');

    }
  });
}
searchSocieties(searchText: string): void {

  const search = (searchText || '')
    .trim()
    .toLowerCase();

  // Search box is empty
  if (!search) {

    this.isSearching = false;

    this.filteredSocieties = [];

    this.currentPage = 1;

    this.updatePagination();

    return;
  }

  // Search is active
  this.isSearching = true;

  this.filteredSocieties = this.societies.filter(society => {

    return (
      (society.society_Name || '')
        .toLowerCase()
        .includes(search)

      ||

      (society.pincode || '')
        .toLowerCase()
        .includes(search)

      ||

      (society.sector || '')
        .toLowerCase()
        .includes(search)

      ||

      (society.landmark || '')
        .toLowerCase()
        .includes(search)

      ||

      (society.plot_No || '')
        .toLowerCase()
        .includes(search)

        ||

          (society.staff_Name || '')
        .toLowerCase()
        .includes(search)

        ||

         String(society.staff_Phone_Number ?? '')
    .toLowerCase()
    .includes(search)


    );

  });

  console.log(
    'Search:',
    search,
    'Results:',
    this.filteredSocieties
  );

  // Start from first page
  this.currentPage = 1;

  // Apply pagination to filtered results
  this.updatePagination();
}
highlightParts(
  value: string | null | undefined
): { text: string; match: boolean }[] {

  if (!value) {
    return [{ text: '-', match: false }];
  }

  const search = this.searchForm.get('search')?.value?.trim();

  if (!search) {
    return [{ text: value, match: false }];
  }

  const escapedSearch = search.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const regex = new RegExp(`(${escapedSearch})`, 'gi');

  return value.split(regex).map(part => ({
    text: part,
    match: part.toLowerCase() === search.toLowerCase()
  }));
}

}
