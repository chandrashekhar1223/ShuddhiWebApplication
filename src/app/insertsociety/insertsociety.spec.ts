import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Insertsociety } from './insertsociety';

describe('Insertsociety', () => {
  let component: Insertsociety;
  let fixture: ComponentFixture<Insertsociety>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Insertsociety]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Insertsociety);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
