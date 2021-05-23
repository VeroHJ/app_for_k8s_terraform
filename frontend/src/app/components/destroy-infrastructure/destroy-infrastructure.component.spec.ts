import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyInfrastructureComponent } from './destroy-infrastructure.component';

describe('DestroyInfrastructureComponent', () => {
  let component: DestroyInfrastructureComponent;
  let fixture: ComponentFixture<DestroyInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestroyInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroyInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
