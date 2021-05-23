import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureStatusComponent } from './infrastructure-status.component';

describe('InfrastructureStatusComponent', () => {
  let component: InfrastructureStatusComponent;
  let fixture: ComponentFixture<InfrastructureStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
