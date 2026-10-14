import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPickupRequest } from './get-pickup-request';

describe('GetPickupRequest', () => {
  let component: GetPickupRequest;
  let fixture: ComponentFixture<GetPickupRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetPickupRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPickupRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
