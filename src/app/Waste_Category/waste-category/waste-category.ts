import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  WasteTypeService,
  WasteType,
  SubWasteType
} from './Waste_Category_Service';

@Component({
  selector: 'app-waste-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './waste-category.html',
  styleUrl: './waste-category.css'
})
export class WasteCategory implements OnInit {

  wasteTypes: WasteType[] = [];
  subWasteTypes: SubWasteType[] = [];

  selectedWasteTypeId: number | null = null;
  selectedWasteSubTypeId: number | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private wasteTypeService: WasteTypeService
  ) {}

  ngOnInit(): void {
    this.loadWasteTypes();
  }

  loadWasteTypes(): void {

    this.loading = true;
    this.errorMessage = '';

    this.wasteTypeService.getWasteTypes().subscribe({
      next: (response) => {

        console.log('Waste Type API Response:', response);

        if (response.outputStatus === 'Success') {

          this.wasteTypes = response.wasteTypes;

        } else {

          this.wasteTypes = [];
          this.errorMessage = 'Unable to load waste types.';

        }

        this.loading = false;
      },

      error: (error) => {

        console.error('Waste Type API Error:', error);

        this.wasteTypes = [];
        this.subWasteTypes = [];

        this.errorMessage = 'Error while loading waste types.';

        this.loading = false;
      }
    });
  }

  onWasteTypeChange(): void {

    console.log(
      'Selected Waste Type ID:',
      this.selectedWasteTypeId
    );

    this.selectedWasteSubTypeId = null;
    this.subWasteTypes = [];

    if (this.selectedWasteTypeId === null) {
      return;
    }

    const selectedWasteType = this.wasteTypes.find(
      x => x.wasteTypeId === Number(this.selectedWasteTypeId)
    );

    if (selectedWasteType) {

      console.log(
        'Selected Waste Type:',
        selectedWasteType
      );

      this.subWasteTypes = selectedWasteType.subWasteTypes;

      console.log(
        'Sub Waste Types:',
        this.subWasteTypes
      );
    }
  }

  onSubWasteTypeChange(): void {

    console.log(
      'Selected Sub Waste Type ID:',
      this.selectedWasteSubTypeId
    );

    const selectedSubWasteType = this.subWasteTypes.find(
      x => x.wasteSubTypeId === Number(this.selectedWasteSubTypeId)
    );

    console.log(
      'Selected Sub Waste Type:',
      selectedSubWasteType
    );
  }
}