import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Societies } from './societies';

describe('Societies', () => {
  let component: Societies;
  let fixture: ComponentFixture<Societies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Societies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Societies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
