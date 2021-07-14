import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestContainerModalComponent } from './interest-container-modal.component';

describe('InterestContainerModalComponent', () => {
  let component: InterestContainerModalComponent;
  let fixture: ComponentFixture<InterestContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestContainerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
