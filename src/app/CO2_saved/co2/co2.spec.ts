import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CO2 } from './co2';

describe('CO2', () => {
  let component: CO2;
  let fixture: ComponentFixture<CO2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CO2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CO2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
