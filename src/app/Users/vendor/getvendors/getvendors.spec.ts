import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Getvendors } from './getvendors';

describe('Getvendors', () => {
  let component: Getvendors;
  let fixture: ComponentFixture<Getvendors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Getvendors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Getvendors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
