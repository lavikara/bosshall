import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNewUiComponent } from './login-new-ui.component';

describe('LoginNewUiComponent', () => {
  let component: LoginNewUiComponent;
  let fixture: ComponentFixture<LoginNewUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginNewUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNewUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
