import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUsers } from './get-users';

describe('GetUsers', () => {
  let component: GetUsers;
  let fixture: ComponentFixture<GetUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
