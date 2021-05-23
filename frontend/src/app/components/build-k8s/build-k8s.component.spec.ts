import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildK8sComponent } from './build-k8s.component';

describe('BuildK8sComponent', () => {
  let component: BuildK8sComponent;
  let fixture: ComponentFixture<BuildK8sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildK8sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildK8sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
