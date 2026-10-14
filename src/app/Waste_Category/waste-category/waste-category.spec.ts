import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteCategory } from './waste-category';

describe('WasteCategory', () => {
  let component: WasteCategory;
  let fixture: ComponentFixture<WasteCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WasteCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
