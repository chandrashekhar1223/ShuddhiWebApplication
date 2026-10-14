import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { SocietyService } from './Insertsocietyservice';

@Component({
  selector: 'app-insertsociety',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './insertsociety.html',
  styleUrl: './insertsociety.css'
})
export class Insertsociety {

  societyForm: FormGroup;

  // Used to identify whether we are adding or editing
  isEditMode: boolean = false;

  // Store Society Id during edit
  societyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private societyService: SocietyService
  ) {

    this.societyForm = this.fb.group({

      Society_Name: [
        '',
        [Validators.required]
      ],

      Pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ],

      Landmark: [
        ''
      ],

      Sector: [
        ''
      ],

      Plot_No: [
        ''
      ],

  Staff_Name: [
        ''
      ],

   Staff_Phone_Number: [
       null

      ],
    });
  }

    ngOnInit(): void {

  const society = history.state.society;

  console.log('Received Society:', society);

  if (society) {

    this.isEditMode = true;

    this.societyId = society.id;

    this.societyForm.patchValue({

      Society_Name: society.society_Name,
      Pincode: society.pincode,
      Landmark: society.landmark,
      Sector: society.sector,
      Plot_No: society.plot_No,
      Staff_Name:society.staff_Name,
      Staff_Phone_Number:society.staff_Phone_Number

    });

  }
}


  get f() {
    return this.societyForm.controls;
  }

  saveSociety(): void {

    if (this.societyForm.invalid) {

      this.societyForm.markAllAsTouched();

      return;
    }

    const societyData = {

      Id: this.societyId,

      Society_Name: this.societyForm.value.Society_Name,

      Pincode: this.societyForm.value.Pincode,

      Landmark: this.societyForm.value.Landmark,

      Sector: this.societyForm.value.Sector,

      Plot_No: this.societyForm.value.Plot_No,
      Staff_Name:this.societyForm.value.Staff_Name,
      Staff_Phone_Number:this.societyForm.value.Staff_Phone_Number

    };
      // Add Id only when editing
  if (this.isEditMode && this.societyId !== null) {
    societyData.Id = this.societyId;
  }

    // UPDATE
    if (this.isEditMode) {

      this.societyService.updateSociety(societyData).subscribe({

        next: (response) => {

          console.log('Society updated successfully:', response);

          alert('Society updated successfully.');

          this.router.navigate(['/societies']);

        },

        error: (error) => {

          console.error('Error updating society:', error);

          alert('Failed to update society.');

        }

      });

    }

    // INSERT
    else {

      this.societyService.addSociety(societyData).subscribe({

        next: (response) => {

          console.log('Society added successfully:', response);

          alert('Society added successfully.');

          this.router.navigate(['/societies']);

        },

        error: (error) => {

          console.error('Error adding society:', error);

          alert('Failed to add society.');

        }

      });

    }
  }

  cancel(): void {

    this.router.navigate(['/societies']);

  }
}
